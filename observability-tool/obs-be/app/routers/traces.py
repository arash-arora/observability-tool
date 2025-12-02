from fastapi import APIRouter, Depends, Query
from typing import Optional
from langfuse import Langfuse
from app.dependencies import get_langfuse
from app.services.langfuse_service import LangfuseService
from app.models.trace import TracesListResponse, TraceDetailResponse

router = APIRouter(prefix="/api/traces", tags=["traces"])


@router.get("", response_model=TracesListResponse)
async def get_traces(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(50, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search query"),
    environment: Optional[str] = Query(None, description="Filter by environment"),
    langfuse: Optional[Langfuse] = Depends(get_langfuse)
):
    """
    Get list of traces with pagination and filters.
    """
    service = LangfuseService(langfuse)
    return service.get_traces(
        page=page,
        page_size=page_size,
        search=search,
        environment=environment
    )


@router.get("/{trace_id}", response_model=TraceDetailResponse)
async def get_trace_by_id(
    trace_id: str,
    langfuse: Optional[Langfuse] = Depends(get_langfuse)
):
    """
    Get detailed trace information including observations tree.
    """
    service = LangfuseService(langfuse)
    trace = service.get_trace_by_id(trace_id)
    
    if not trace:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Trace not found")
    
    return trace
