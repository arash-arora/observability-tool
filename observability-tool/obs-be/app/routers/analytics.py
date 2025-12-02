from fastapi import APIRouter, Depends
from typing import List, Optional
from langfuse import Langfuse
from app.dependencies import get_langfuse
from app.services.analytics_service import AnalyticsService
from app.models.analytics import (
    OverviewMetrics,
    UsageTrendsData,
    CostByModelData,
    LatencyDistributionData,
    ModelComparisonData,
    QualityScoreData
)

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/overview", response_model=OverviewMetrics)
async def get_overview(langfuse: Optional[Langfuse] = Depends(get_langfuse)):
    """Get overview metrics for the dashboard."""
    service = AnalyticsService(langfuse)
    return service.get_overview_metrics()


@router.get("/usage-trends", response_model=List[UsageTrendsData])
async def get_usage_trends(langfuse: Optional[Langfuse] = Depends(get_langfuse)):
    """Get usage trends over time."""
    service = AnalyticsService(langfuse)
    return service.get_usage_trends()


@router.get("/cost-by-model", response_model=List[CostByModelData])
async def get_cost_by_model(langfuse: Optional[Langfuse] = Depends(get_langfuse)):
    """Get cost breakdown by model."""
    service = AnalyticsService(langfuse)
    return service.get_cost_by_model()


@router.get("/latency-distribution", response_model=List[LatencyDistributionData])
async def get_latency_distribution(langfuse: Optional[Langfuse] = Depends(get_langfuse)):
    """Get latency distribution."""
    service = AnalyticsService(langfuse)
    return service.get_latency_distribution()


@router.get("/model-comparison", response_model=List[ModelComparisonData])
async def get_model_comparison(langfuse: Optional[Langfuse] = Depends(get_langfuse)):
    """Get model comparison data."""
    service = AnalyticsService(langfuse)
    return service.get_model_comparison()


@router.get("/quality-scores", response_model=List[QualityScoreData])
async def get_quality_scores(langfuse: Optional[Langfuse] = Depends(get_langfuse)):
    """Get quality scores over time."""
    service = AnalyticsService(langfuse)
    return service.get_quality_scores()
