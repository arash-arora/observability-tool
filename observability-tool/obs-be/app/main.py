from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import traces, analytics, health

# Create FastAPI app
app = FastAPI(
    title="Langfuse Observability API",
    description="Backend API for Langfuse observability dashboard",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router)
app.include_router(traces.router)
app.include_router(analytics.router)


@app.on_event("startup")
async def startup_event():
    """Run on application startup."""
    print(f"Starting Langfuse Observability API on {settings.api_host}:{settings.api_port}")
    print(f"Environment: {settings.environment}")
    print(f"Langfuse Host: {settings.langfuse_host}")


@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown."""
    print("Shutting down Langfuse Observability API")


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Langfuse Observability API",
        "version": "1.0.0",
        "docs": "/docs"
    }
