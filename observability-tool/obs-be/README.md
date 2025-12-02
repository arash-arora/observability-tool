# Langfuse Observability API

FastAPI backend for the Langfuse observability dashboard.

## Features

- **Traces API**: Fetch and display LLM traces with observations
- **Analytics API**: Dashboard metrics for LLMOps and AgentOps
- **Langfuse Integration**: Direct integration with Langfuse SDK
- **CORS Support**: Configured for Next.js frontend

## Setup

### 1. Install Dependencies

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `env.example` to `.env` and update with your Langfuse credentials:

```bash
cp env.example .env
```

Edit `.env`:
```env
LANGFUSE_PUBLIC_KEY=pk-lf-your-key
LANGFUSE_SECRET_KEY=sk-lf-your-secret
LANGFUSE_HOST=https://cloud.langfuse.com
```

### 3. Run the Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Health
- `GET /health` - Health check

### Traces
- `GET /api/traces` - List traces (with pagination)
- `GET /api/traces/{trace_id}` - Get trace details

### Analytics
- `GET /api/analytics/overview` - Overview metrics
- `GET /api/analytics/usage-trends` - Usage trends
- `GET /api/analytics/cost-by-model` - Cost by model
- `GET /api/analytics/latency-distribution` - Latency distribution
- `GET /api/analytics/model-comparison` - Model comparison
- `GET /api/analytics/quality-scores` - Quality scores

## Development

### Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app
│   ├── config.py            # Configuration
│   ├── dependencies.py      # DI
│   ├── models/              # Pydantic models
│   ├── routers/             # API routes
│   └── services/            # Business logic
├── requirements.txt
└── env.example
```

### Testing

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test traces endpoint
curl http://localhost:8000/api/traces

# Test analytics
curl http://localhost:8000/api/analytics/overview
```

## Notes

- The backend includes fallback mock data when Langfuse is not configured
- CORS is configured for `http://localhost:3000` (Next.js default)
- All endpoints return JSON responses
