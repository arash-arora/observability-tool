from pydantic import BaseModel
from typing import List, Dict, Any


class OverviewMetrics(BaseModel):
    total_traces: int
    total_cost: float
    avg_latency: float
    success_rate: float


class UsageTrendsData(BaseModel):
    date: str
    traces: int
    generations: int
    spans: int


class CostByModelData(BaseModel):
    model: str
    cost: float
    tokens: int


class LatencyDistributionData(BaseModel):
    range: str
    count: int


class ModelComparisonData(BaseModel):
    model: str
    p50: float
    p95: float
    p99: float
    cost_per_request: float
    cost_per_1k_tokens: float


class QualityScoreData(BaseModel):
    date: str
    user_score: float
    ai_score: float
