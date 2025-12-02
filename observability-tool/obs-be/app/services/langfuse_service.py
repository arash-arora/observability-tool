from langfuse import Langfuse
from typing import List, Optional, Dict, Any
from app.models.trace import TraceResponse, TraceDetailResponse, ObservationResponse, TracesListResponse
from datetime import datetime
import math


class LangfuseService:
    def __init__(self, client: Optional[Langfuse]):
        self.client = client
    
    def get_traces(
        self, 
        page: int = 1, 
        page_size: int = 50,
        search: Optional[str] = None,
        environment: Optional[str] = None
    ) -> TracesListResponse:
        """
        Fetch traces from Langfuse with pagination and filters.
        """
        try:
            # Fetch traces from Langfuse
            # Note: Langfuse SDK uses different pagination - adjust as needed
            traces_data = self.client.fetch_traces(
                page=page,
                limit=page_size
            )
            
            traces = []
            for trace in traces_data.data:
                # Transform Langfuse trace to our format
                trace_response = self._transform_trace(trace)
                traces.append(trace_response)
            
            total = traces_data.meta.total_items if hasattr(traces_data, 'meta') else len(traces)
            total_pages = math.ceil(total / page_size)
            
            return TracesListResponse(
                traces=traces,
                total=total,
                page=page,
                page_size=page_size,
                total_pages=total_pages
            )
        except Exception as e:
            # Return mock data if Langfuse is not configured
            return self._get_mock_traces(page, page_size)
    
    def get_trace_by_id(self, trace_id: str) -> Optional[TraceDetailResponse]:
        """
        Fetch a single trace with all observations.
        """
        try:
            trace = self.client.fetch_trace(trace_id)
            
            if not trace:
                return None
            
            # Transform trace and observations
            trace_response = self._transform_trace(trace)
            observations = self._build_observation_tree(trace)
            
            return TraceDetailResponse(
                **trace_response.model_dump(),
                observations=observations
            )
        except Exception as e:
            # Return mock data
            return self._get_mock_trace_detail(trace_id)
    
    def _transform_trace(self, trace: Any) -> TraceResponse:
        """Transform Langfuse trace object to TraceResponse."""
        # Calculate latency
        latency = None
        if hasattr(trace, 'timestamp') and hasattr(trace, 'end_time'):
            if trace.end_time and trace.timestamp:
                delta = (trace.end_time - trace.timestamp).total_seconds()
                latency = f"{delta:.2f}s"
        
        # Calculate cost
        cost = None
        if hasattr(trace, 'calculated_total_cost') and trace.calculated_total_cost:
            cost = f"${trace.calculated_total_cost:.6f}"
        
        # Get tokens
        tokens = None
        if hasattr(trace, 'usage'):
            input_tokens = getattr(trace.usage, 'input', 0) if trace.usage else 0
            output_tokens = getattr(trace.usage, 'output', 0) if trace.usage else 0
            if input_tokens or output_tokens:
                tokens = f"{input_tokens} → {output_tokens}"
        
        return TraceResponse(
            id=trace.id,
            timestamp=trace.timestamp.isoformat() if hasattr(trace, 'timestamp') else datetime.now().isoformat(),
            name=getattr(trace, 'name', 'Unnamed Trace'),
            input=str(getattr(trace, 'input', ''))[:100] + '...' if getattr(trace, 'input', None) else None,
            output=str(getattr(trace, 'output', ''))[:100] + '...' if getattr(trace, 'output', None) else None,
            latency=latency,
            cost=cost,
            tokens=tokens,
            status=getattr(trace, 'status', 'success'),
            environment=getattr(trace, 'release', None),
            user_id=getattr(trace, 'user_id', None),
            session_id=getattr(trace, 'session_id', None),
            tags=getattr(trace, 'tags', []),
            metadata=getattr(trace, 'metadata', {})
        )
    
    def _build_observation_tree(self, trace: Any) -> List[ObservationResponse]:
        """Build hierarchical observation tree from trace."""
        observations = []
        
        if hasattr(trace, 'observations'):
            # Group observations by parent_observation_id
            obs_map = {}
            root_observations = []
            
            for obs in trace.observations:
                obs_response = self._transform_observation(obs)
                obs_map[obs.id] = obs_response
                
                if not obs.parent_observation_id:
                    root_observations.append(obs_response)
            
            # Build tree structure
            for obs in trace.observations:
                if obs.parent_observation_id and obs.parent_observation_id in obs_map:
                    parent = obs_map[obs.parent_observation_id]
                    if parent.children is None:
                        parent.children = []
                    parent.children.append(obs_map[obs.id])
            
            observations = root_observations
        
        return observations
    
    def _transform_observation(self, obs: Any) -> ObservationResponse:
        """Transform Langfuse observation to ObservationResponse."""
        latency = None
        if hasattr(obs, 'start_time') and hasattr(obs, 'end_time'):
            if obs.end_time and obs.start_time:
                delta = (obs.end_time - obs.start_time).total_seconds()
                latency = f"{delta:.2f}s"
        
        cost = None
        if hasattr(obs, 'calculated_total_cost') and obs.calculated_total_cost:
            cost = f"${obs.calculated_total_cost:.6f}"
        
        return ObservationResponse(
            id=obs.id,
            name=getattr(obs, 'name', 'Unnamed'),
            type=getattr(obs, 'type', 'SPAN'),
            start_time=obs.start_time.isoformat() if hasattr(obs, 'start_time') and obs.start_time else None,
            end_time=obs.end_time.isoformat() if hasattr(obs, 'end_time') and obs.end_time else None,
            latency=latency,
            cost=cost,
            status=getattr(obs, 'status_message', 'success'),
            input=getattr(obs, 'input', None),
            output=getattr(obs, 'output', None),
            metadata=getattr(obs, 'metadata', {}),
            model=getattr(obs, 'model', None)
        )
    
    
    def _get_mock_traces(self, page: int, page_size: int) -> TracesListResponse:
        """Return mock traces data when Langfuse is not configured."""
        # Comprehensive mock data with variety
        all_mock_traces = [
            TraceResponse(
                id="tr_a1b2c3d4e5",
                timestamp="2025-11-21 21:09:52",
                name="Execute evaluator: error-analysis",
                input="The agent may only answer questions related to Langfuse or the broader LLM/AI space...",
                output='{"reasoning":"The answer is fully focused on Langfuse and provides accurate information...","score":1}',
                latency="1.63s",
                cost="$0.000362",
                tokens="752 → 38",
                status="success",
                environment="langfuse-llm-as-a-judge",
                tags=["evaluator", "error-analysis"]
            ),
            TraceResponse(
                id="tr_f6g7h8i9j0",
                timestamp="2025-11-21 21:09:51",
                name="Execute evaluator: is_question",
                input="Is the following user message a question?\n\nWhat can I use Langfuse for?",
                output='{"reasoning":"The user message is phrased as a question with a question mark...","score":1}',
                latency="1.52s",
                cost="$0.000341",
                tokens="698 → 35",
                status="success",
                environment="default",
                tags=["evaluator", "classification"]
            ),
            TraceResponse(
                id="tr_k1l2m3n4o5",
                timestamp="2025-11-21 21:09:51",
                name="Execute evaluator: helpfulness",
                input="Evaluate the helpfulness of the generation on a continuous scale from 0 to 1...",
                output='{"reasoning":"The generation directly repeats the user\'s question without providing any answer...","score":0.1}',
                latency="1.48s",
                cost="$0.000328",
                tokens="665 → 32",
                status="success",
                environment="sdk-experiment",
                tags=["evaluator", "quality"]
            ),
            TraceResponse(
                id="tr_p6q7r8s9t0",
                timestamp="2025-11-21 21:09:50",
                name="Execute evaluator: is_same_language",
                input="Are these two languages the same?\n\n## Text 1\n\nWhat can I use Langfuse for?\n\n## Text 2\n\nLangfuse is great for observability...",
                output='{"reasoning":"Text 1 is a question in English, and Text 2 is a statement in English...","score":1}',
                latency="1.41s",
                cost="$0.000315",
                tokens="642 → 30",
                status="success",
                environment="default",
                tags=["evaluator", "language"]
            ),
            TraceResponse(
                id="tr_u1v2w3x4y5",
                timestamp="2025-11-21 21:09:31",
                name="Execute evaluator: contains_pii",
                input="Does this text contain any PII (personal identifiable information)?\n\nText: What can I use Langfuse for?",
                output='{"reasoning":"No PII is present in the text","score":0}',
                latency="1.38s",
                cost="$0.000298",
                tokens="615 → 28",
                status="success",
                environment="default",
                tags=["evaluator", "pii", "security"]
            ),
            TraceResponse(
                id="tr_z6a7b8c9d0",
                timestamp="2025-11-21 21:09:00",
                name="QA-Chatbot",
                input="What can I use Langfuse for?",
                output="# What you can use Langfuse for - Observability (tracing in production) - Analytics (understanding usage patterns) - Evaluation (testing LLM outputs) - Prompt management",
                latency="2.15s",
                cost="$0.001245",
                tokens="1250 → 180",
                status="success",
                environment="production",
                user_id="user_abc123",
                session_id="session_xyz789",
                tags=["chatbot", "production"]
            ),
            TraceResponse(
                id="tr_e1f2g3h4i5",
                timestamp="2025-11-21 20:41:09",
                name="Execute evaluator: error-analysis",
                input="The agent may only answer questions related to Langfuse or the broader LLM/AI space...",
                output='{"reasoning":"The answer is fully focused on Langfuse and provides accurate information...","score":1}',
                latency="1.55s",
                cost="$0.000352",
                tokens="740 → 36",
                status="error",
                environment="langfuse-llm-as-a-judge",
                tags=["evaluator", "error"]
            ),
            TraceResponse(
                id="tr_j6k7l8m9n0",
                timestamp="2025-11-21 20:41:08",
                name="Execute evaluator: helpfulness",
                input="Evaluate the helpfulness of the generation on a continuous scale from 0 to 1...",
                output='{"reasoning":"The generation is comprehensive and helpful, providing detailed information...","score":0.95}',
                latency="1.62s",
                cost="$0.000368",
                tokens="765 → 39",
                status="success",
                environment="sdk-experiment",
                tags=["evaluator", "quality"]
            ),
        ]
        
        # Paginate the mock data
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        paginated_traces = all_mock_traces[start_idx:end_idx]
        
        total = len(all_mock_traces)
        total_pages = math.ceil(total / page_size)
        
        return TracesListResponse(
            traces=paginated_traces,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages
        )
    
    def _get_mock_trace_detail(self, trace_id: str) -> TraceDetailResponse:
        """Return mock trace detail when Langfuse is not configured."""
        return TraceDetailResponse(
            id=trace_id,
            timestamp="2025-11-21 21:09:52",
            name="Chat Interaction",
            input='{"messages":[{"role":"user","content":"Hello, how are you?"}]}',
            output='{"content":"I am an AI assistant, here to help you."}',
            latency="1.2s",
            cost="$0.0024",
            tokens="850 → 120",
            status="success",
            environment="production",
            user_id="user_abc123",
            session_id="session_xyz789",
            tags=["chatbot", "production"],
            metadata={"version": "1.0.0", "model": "gpt-4"},
            observations=[
                ObservationResponse(
                    id="root",
                    name="Chat Interaction",
                    type="SPAN",
                    start_time="2023-10-26T10:23:45.000Z",
                    end_time="2023-10-26T10:23:46.200Z",
                    latency="1.2s",
                    cost="$0.0024",
                    status="success",
                    input={"messages": [{"role": "user", "content": "Hello, how are you?"}]},
                    output={"content": "I am an AI assistant, here to help you."},
                    children=[
                        ObservationResponse(
                            id="retrieval",
                            name="Retrieve Context",
                            type="SPAN",
                            start_time="2023-10-26T10:23:45.050Z",
                            end_time="2023-10-26T10:23:45.450Z",
                            latency="0.4s",
                            status="success",
                            input={"query": "Hello, how are you?"},
                            output={"documents": []},
                            children=[
                                ObservationResponse(
                                    id="embedding",
                                    name="Embedding Generation",
                                    type="GENERATION",
                                    start_time="2023-10-26T10:23:45.050Z",
                                    end_time="2023-10-26T10:23:45.150Z",
                                    latency="0.1s",
                                    cost="$0.0001",
                                    status="success",
                                    model="text-embedding-ada-002",
                                    input={"text": "Hello, how are you?"},
                                    output={"embedding": [0.1, 0.2, 0.3]}
                                ),
                                ObservationResponse(
                                    id="db_query",
                                    name="Vector DB Query",
                                    type="SPAN",
                                    start_time="2023-10-26T10:23:45.150Z",
                                    end_time="2023-10-26T10:23:45.450Z",
                                    latency="0.3s",
                                    status="success",
                                    input={"vector": [0.1, 0.2, 0.3]},
                                    output={"results": []}
                                )
                            ]
                        ),
                        ObservationResponse(
                            id="llm_call",
                            name="LLM Generation (GPT-4)",
                            type="GENERATION",
                            start_time="2023-10-26T10:23:45.500Z",
                            end_time="2023-10-26T10:23:46.200Z",
                            latency="0.7s",
                            cost="$0.0023",
                            status="success",
                            model="gpt-4",
                            input={"model": "gpt-4", "messages": [{"role": "user", "content": "Hello, how are you?"}]},
                            output={"choices": [{"message": {"content": "I am an AI assistant, here to help you."}}]}
                        )
                    ]
                )
            ]
        )
