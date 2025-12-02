from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class ObservationResponse(BaseModel):
    id: str
    name: str
    type: str  # SPAN, GENERATION, EVENT
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    latency: Optional[str] = None
    cost: Optional[str] = None
    status: Optional[str] = "success"
    input: Optional[Dict[str, Any]] = None
    output: Optional[Dict[str, Any]] = None
    metadata: Optional[Dict[str, Any]] = None
    model: Optional[str] = None
    children: Optional[List['ObservationResponse']] = []


class TraceResponse(BaseModel):
    id: str
    timestamp: str
    name: str
    input: Optional[str] = None
    output: Optional[str] = None
    latency: Optional[str] = None
    cost: Optional[str] = None
    tokens: Optional[str] = None
    status: str = "success"
    environment: Optional[str] = None
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    tags: Optional[List[str]] = []
    metadata: Optional[Dict[str, Any]] = None


class TraceDetailResponse(TraceResponse):
    observations: List[ObservationResponse] = []


class TracesListResponse(BaseModel):
    traces: List[TraceResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


# Update forward references
ObservationResponse.model_rebuild()
