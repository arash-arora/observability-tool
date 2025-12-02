const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface TraceResponse {
  id: string;
  timestamp: string;
  name: string;
  input?: string;
  output?: string;
  latency?: string;
  cost?: string;
  tokens?: string;
  status: string;
  environment?: string;
  user_id?: string;
  session_id?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface TracesListResponse {
  traces: TraceResponse[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ObservationResponse {
  id: string;
  name: string;
  type: string;
  start_time?: string;
  end_time?: string;
  latency?: string;
  cost?: string;
  status?: string;
  input?: Record<string, any>;
  output?: Record<string, any>;
  metadata?: Record<string, any>;
  model?: string;
  children?: ObservationResponse[];
}

export interface TraceDetailResponse extends TraceResponse {
  observations: ObservationResponse[];
}

export interface OverviewMetrics {
  total_traces: number;
  total_cost: number;
  avg_latency: number;
  success_rate: number;
}

export interface UsageTrendsData {
  date: string;
  traces: number;
  generations: number;
  spans: number;
}

export interface CostByModelData {
  model: string;
  cost: number;
  tokens: number;
}

export interface LatencyDistributionData {
  range: string;
  count: number;
}

export interface ModelComparisonData {
  model: string;
  p50: number;
  p95: number;
  p99: number;
  cost_per_request: number;
  cost_per_1k_tokens: number;
}

export interface QualityScoreData {
  date: string;
  user_score: number;
  ai_score: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`API request failed: ${url}`, error);
      throw error;
    }
  }

  // Traces endpoints
  async getTraces(params?: {
    page?: number;
    page_size?: number;
    search?: string;
    environment?: string;
  }): Promise<TracesListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.environment) queryParams.append('environment', params.environment);

    const query = queryParams.toString();
    return this.fetch<TracesListResponse>(`/api/traces${query ? `?${query}` : ''}`);
  }

  async getTraceById(traceId: string): Promise<TraceDetailResponse> {
    return this.fetch<TraceDetailResponse>(`/api/traces/${traceId}`);
  }

  // Analytics endpoints
  async getOverviewMetrics(): Promise<OverviewMetrics> {
    return this.fetch<OverviewMetrics>('/api/analytics/overview');
  }

  async getUsageTrends(): Promise<UsageTrendsData[]> {
    return this.fetch<UsageTrendsData[]>('/api/analytics/usage-trends');
  }

  async getCostByModel(): Promise<CostByModelData[]> {
    return this.fetch<CostByModelData[]>('/api/analytics/cost-by-model');
  }

  async getLatencyDistribution(): Promise<LatencyDistributionData[]> {
    return this.fetch<LatencyDistributionData[]>('/api/analytics/latency-distribution');
  }

  async getModelComparison(): Promise<ModelComparisonData[]> {
    return this.fetch<ModelComparisonData[]>('/api/analytics/model-comparison');
  }

  async getQualityScores(): Promise<QualityScoreData[]> {
    return this.fetch<QualityScoreData[]>('/api/analytics/quality-scores');
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.fetch('/health');
  }
}

export const apiClient = new ApiClient();
