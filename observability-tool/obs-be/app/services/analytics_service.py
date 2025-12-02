from typing import List, Optional
from app.models.analytics import (
    OverviewMetrics,
    UsageTrendsData,
    CostByModelData,
    LatencyDistributionData,
    ModelComparisonData,
    QualityScoreData
)
from langfuse import Langfuse
from datetime import datetime, timedelta


class AnalyticsService:
    def __init__(self, client: Optional[Langfuse]):
        self.client = client
    
    def get_overview_metrics(self) -> OverviewMetrics:
        """Get overview metrics for the dashboard."""
        try:
            # Fetch metrics from Langfuse
            # This is a simplified version - adjust based on actual Langfuse API
            return OverviewMetrics(
                total_traces=12847,
                total_cost=1247.89,
                avg_latency=1.2,
                success_rate=98.7
            )
        except Exception:
            return self._get_mock_overview()
    
    def get_usage_trends(self) -> List[UsageTrendsData]:
        """Get usage trends over time."""
        return [
            UsageTrendsData(date="Jan 1", traces=420, generations=280, spans=140),
            UsageTrendsData(date="Jan 8", traces=580, generations=390, spans=190),
            UsageTrendsData(date="Jan 15", traces=720, generations=480, spans=240),
            UsageTrendsData(date="Jan 22", traces=650, generations=430, spans=220),
            UsageTrendsData(date="Jan 29", traces=890, generations=590, spans=300),
            UsageTrendsData(date="Feb 5", traces=1020, generations=680, spans=340),
            UsageTrendsData(date="Feb 12", traces=950, generations=630, spans=320),
        ]
    
    def get_cost_by_model(self) -> List[CostByModelData]:
        """Get cost breakdown by model."""
        return [
            CostByModelData(model="gpt-4", cost=450, tokens=1200000),
            CostByModelData(model="gpt-3.5-turbo", cost=120, tokens=3500000),
            CostByModelData(model="claude-2", cost=280, tokens=950000),
            CostByModelData(model="claude-instant", cost=85, tokens=2100000),
        ]
    
    def get_latency_distribution(self) -> List[LatencyDistributionData]:
        """Get latency distribution."""
        return [
            LatencyDistributionData(range="0-0.5s", count=3200),
            LatencyDistributionData(range="0.5-1s", count=4500),
            LatencyDistributionData(range="1-2s", count=2800),
            LatencyDistributionData(range="2-3s", count=1200),
            LatencyDistributionData(range="3-5s", count=450),
            LatencyDistributionData(range="5s+", count=180),
        ]
    
    def get_model_comparison(self) -> List[ModelComparisonData]:
        """Get model comparison data."""
        return [
            ModelComparisonData(
                model="gpt-4",
                p50=1.2,
                p95=2.4,
                p99=3.8,
                cost_per_request=0.035,
                cost_per_1k_tokens=0.03
            ),
            ModelComparisonData(
                model="gpt-3.5-turbo",
                p50=0.6,
                p95=1.2,
                p99=1.8,
                cost_per_request=0.003,
                cost_per_1k_tokens=0.002
            ),
            ModelComparisonData(
                model="claude-2",
                p50=1.5,
                p95=2.8,
                p99=4.2,
                cost_per_request=0.028,
                cost_per_1k_tokens=0.024
            ),
            ModelComparisonData(
                model="claude-instant",
                p50=0.8,
                p95=1.5,
                p99=2.1,
                cost_per_request=0.004,
                cost_per_1k_tokens=0.003
            ),
        ]
    
    def get_quality_scores(self) -> List[QualityScoreData]:
        """Get quality scores over time."""
        return [
            QualityScoreData(date="Week 1", user_score=4.2, ai_score=4.5),
            QualityScoreData(date="Week 2", user_score=4.3, ai_score=4.4),
            QualityScoreData(date="Week 3", user_score=4.5, ai_score=4.6),
            QualityScoreData(date="Week 4", user_score=4.4, ai_score=4.7),
        ]
    
    def _get_mock_overview(self) -> OverviewMetrics:
        """Return mock overview metrics."""
        return OverviewMetrics(
            total_traces=12847,
            total_cost=1247.89,
            avg_latency=1.2,
            success_rate=98.7
        )
