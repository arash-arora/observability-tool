from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.db import _get_client
from datetime import datetime, timedelta

app = FastAPI(title="Observability Metrics API")

# --- Enable CORS for frontend ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ 1. Trace Volume (last 24h)
@app.get("/metrics/trace_volume")
def trace_volume(client = Depends(_get_client)):

    query = """
        SELECT
            formatDateTime(event_ts, '%H:00') AS hour,
            count() AS traces
        FROM observations
        WHERE type = 'GENERATION'
          AND event_ts >= now() - INTERVAL 24 HOUR
        GROUP BY hour
        ORDER BY hour ASC
    """
    rows = client.query(query).result_rows
    return [{"time": r[0], "traces": int(r[1])} for r in rows]


# ✅ 2. Token Usage by Model
@app.get("/metrics/token_usage")
def token_usage(client = Depends(_get_client)):

    # This query handles both Map() and JSON string column types.
    # If usage_details is a Map, mapElement() works.
    # If it's a JSON string, JSONExtractUInt() is used.
    # Works across Langfuse versions.
    query = """SELECT
    provided_model_name AS model,
    sum(coalesce(usage_details['input'],  provided_usage_details['input']))  AS input_tokens,
    sum(coalesce(usage_details['output'], provided_usage_details['output'])) AS output_tokens,
    sum(coalesce(usage_details['total'],  provided_usage_details['total']))  AS total_tokens
FROM observations
WHERE provided_model_name IS NOT NULL
GROUP BY model
ORDER BY total_tokens DESC LIMIT 5
    """

    rows = client.query(query).result_rows
    return [
        {
            "model": r[0],
            "total": int(r[1] or 0),
            "prompt": int(r[2] or 0),
            "completion": int(r[3] or 0),
        }
        for r in rows
    ]


# ✅ 3. Latency by Model
@app.get("/metrics/latency_by_model")
def latency_by_model(client = Depends(_get_client)):

    query = """
        SELECT
            coalesce(provided_model_name, internal_model_id, 'unknown') AS model,
            round(avg(greatest(toFloat64(end_time - start_time), 0)), 3) AS avg_latency,
            count() AS requests
        FROM observations
        WHERE type = 'GENERATION' AND end_time IS NOT NULL
        GROUP BY model
        ORDER BY requests DESC LIMIT 5
    """
    rows = client.query(query).result_rows
    return [
        {
            "model": r[0],
            "avg_latency": float(r[1]) if r[1] is not None else 0.0,
            "requests": int(r[2]),
        }
        for r in rows
    ]

@app.get("/metrics/total_tokens")
def get_total_tokens_used(client = Depends(_get_client)):
    query = """SELECT
            sum(coalesce(usage_details['total'], provided_usage_details['total'])) AS total_tokens
        FROM observations
        WHERE type = 'GENERATION'"""
    result = client.query(query).result_rows
    total = int(result[0][0]) if result and result[0][0] is not None else 0
    return {"total_tokens": total}

@app.get("/metrics/average_latency")
def average_latency_total():
    """
    Returns the overall average latency (seconds) across all GENERATION observations.
    """
    client = _get_client()
    query = """
        SELECT
            round(avg(greatest(toFloat64(end_time - start_time), 0)), 3) AS avg_latency
        FROM observations
        WHERE type = 'GENERATION' AND end_time IS NOT NULL
    """
    result = client.query(query).result_rows
    avg_latency = float(result[0][0]) if result and result[0][0] is not None else 0.0
    return {"average_latency": avg_latency}

@app.get("/metrics/total_cost")
def get_total_cost():
    """
    Returns the overall total cost ($) across all GENERATION observations.
    """
    client = _get_client()
    query = """
        SELECT SUM(total_cost) FROM observations
    """
    result = client.query(query).result_rows
    total_cost = float(result[0][0]) if result and result[0][0] is not None else 0.0
    return {"total_cost": total_cost}

@app.get("/metrics/success_rate")
def success_rate():
    """
    Returns the success rate (percentage) of all GENERATION observations.
    A 'success' is identified when status_message = 'success' or level = 'DEFAULT'.
    """
    client = _get_client()
    query = """
        SELECT
            round(
                (countIf(status_message = 'success' OR level = 'DEFAULT') / count()) * 100, 2
            ) AS success_rate
        FROM observations
        WHERE type = 'GENERATION'
    """
    result = client.query(query).result_rows
    success_rate = float(result[0][0]) if result and result[0][0] is not None else 0.0
    return {"success_rate": success_rate}
