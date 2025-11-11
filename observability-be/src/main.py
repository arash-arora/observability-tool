from typing import Optional
from fastapi import Depends, FastAPI, HTTPException, Query
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
def average_latency_total(client = Depends(_get_client)):
    """
    Returns the overall average latency (seconds) across all GENERATION observations.
    """
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
def get_total_cost(client = Depends(_get_client)):
    """
    Returns the overall total cost ($) across all GENERATION observations.
    """
    query = """
        SELECT SUM(total_cost) FROM observations
    """
    result = client.query(query).result_rows
    total_cost = float(result[0][0]) if result and result[0][0] is not None else 0.0
    return {"total_cost": total_cost}

@app.get("/metrics/success_rate")
def success_rate(client = Depends(_get_client)):
    """
    Returns the success rate (percentage) of all GENERATION observations.
    A 'success' is identified when status_message = 'success' or level = 'DEFAULT'.
    """
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

@app.get("/traces")
def get_traces(project_id: str = Query(...), client = Depends(_get_client)):
    """Fetch all traces for a given project_id."""
    query = f"""
        SELECT
            t.id AS trace_id,
            t.timestamp,
            t.name,
            t.input,
            t.output,
            t.bookmarked,
            o.total_cost,
            o.usage_details,
            toFloat64(o.end_time - o.start_time) AS latency
        FROM traces AS t
        JOIN observations AS o ON t.id = o.trace_id
        WHERE t.project_id = '{project_id}'
        LIMIT 100
    """
    return client.query(query).named_results()

@app.get("/traces/details")
def get_trace_with_observations_and_scores(
    project_id: Optional[str] = Query(None, description="Project ID"),
    trace_id: Optional[str] = Query(None, description="Trace ID"),
    timestamp: Optional[datetime] = Query(None, description="Optional timestamp filter"),
    client = Depends(_get_client),
):
    """Retrieve trace data with associated observations, scores, and computed totals."""

    obs_query = f"""
    SELECT
        id,
        trace_id,
        project_id,
        type,
        parent_observation_id,
        environment,
        start_time,
        end_time,
        name,
        level,
        status_message,
        version,
        input,
        output,
        metadata,
        provided_model_name,
        internal_model_id,
        model_parameters,
        provided_usage_details,
        usage_details,
        provided_cost_details,
        cost_details,
        total_cost,
        completion_start_time,
        prompt_id,
        prompt_name,
        prompt_version,
        created_at,
        updated_at,
        event_ts
    FROM observations
    WHERE trace_id = '{trace_id}'
      AND project_id = '{project_id}'
    ORDER BY event_ts DESC
    LIMIT 1 BY id, project_id
    """

    # Convert generator → list
    try:
        obs_gen = client.query(obs_query).named_results()
        observations = list(obs_gen)
    except Exception as e:
        return {"detail": "Failed to query observations", "error": str(e)}

    if not observations:
        return {"detail": "No observations found for this trace."}

    root_obs = next(
    (obs for obs in observations if not obs.get("parent_observation_id")),
    observations[0],  # fallback to first if all have parents
)

    # --- Compute latency_seconds from first observation ---
    latency_seconds = None
    def safe_to_datetime(val):
        """Convert ClickHouse/Python/str datetime variants safely."""
        if isinstance(val, datetime):
            return val
        if isinstance(val, str):
            try:
                return datetime.fromisoformat(val.replace("Z", "+00:00"))
            except Exception:
                pass
        return None
    
    latency_seconds = None
    start_dt = safe_to_datetime(root_obs.get("start_time"))
    end_dt = safe_to_datetime(root_obs.get("end_time"))

    if start_dt and end_dt:
        latency_seconds = (end_dt - start_dt).total_seconds()

    # --- Compute total cost & total tokens across all observations ---
    total_cost = 0.0
    total_tokens = 0

    for obs in observations:
        # Sum cost
        cost = obs.get("total_cost")
        try:
            total_cost += float(cost)
        except:
            pass

        # Sum token usage if exists
        usage_details = obs.get("usage_details")
        if usage_details and isinstance(usage_details, dict):
            token_val = usage_details.get("total") or 0
            if isinstance(token_val, (int, float)):
                total_tokens += token_val

    # --- Optionally fetch scores (if table exists) ---
    score_query = f"""
    SELECT id, name, value, description, created_at
    FROM scores
    WHERE trace_id = '{trace_id}'
      AND project_id = '{project_id}'
    ORDER BY created_at DESC
    """
    try:
        scores = list(client.query(score_query).named_results())
    except Exception:
        scores = []

    # --- Build response ---
    trace_details = {
        "trace_id": root_obs.get("trace_id"),
        "trace_name": root_obs.get("name"),
        "trace_environment": root_obs.get("environment"),
        "trace_input": root_obs.get("input"),
        "trace_output": root_obs.get("output"),
        "trace_metadata": root_obs.get("metadata"),
        "latency_seconds": latency_seconds,
        "trace_created_at": root_obs.get("created_at"),
        "observations": observations,
        "scores": scores,
        "total_cost": total_cost,
        "total_tokens": total_tokens,
    }

    return trace_details

