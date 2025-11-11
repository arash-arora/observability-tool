"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Star,
  ChevronRight,
  X,
  Clock,
  DollarSign,
  Globe,
} from "lucide-react";

interface TraceSummary {
  trace_id: string;
  name: string;
  input: string;
  output: string;
  latency?: number;
  tokens?: string;
  total_cost?: string;
  timestamp?: string | Date;
  bookmarked?: boolean;
}

interface Observation {
  id: string;
  trace_id: string;
  project_id: string;
  name: string;
  type: string;
  parent_observation_id?: string | null;
  environment: string;
  start_time?: string | Date;
  end_time?: string | Date;
  level?: string;
  status_message?: string;
  version?: string;
  input?: string;
  output?: string;
  provided_model_name?: string;
  internal_model_id?: string;
  model_parameters?: {
    temperature?: number;
    top_p?: number;
    max_tokens?: number;
    [key: string]: any;
  };
  usage_details?: {
    input?: number;
    output?: number;
    total?: number;
    [key: string]: number | undefined;
  };
  cost_details?: {
    input?: number;
    output?: number;
    total?: number;
    currency?: string;
    [key: string]: number | string | undefined;
  };
  total_cost?: number;
  metadata?: Record<string, any>;
  completion_start_time?: string | Date;
  prompt_id?: string;
  prompt_name?: string;
  prompt_version?: string;
  created_at: string | Date;
  updated_at?: string | Date;
  event_ts?: string | Date;
  scores?: {
    id: string;
    name: string;
    value: number;
    description?: string;
    created_at?: string | Date;
  }[];
}

interface TraceDetails {
  trace_id: string;
  trace_name: string;
  trace_environment?: string;
  trace_input?: string;
  trace_output?: string;
  trace_metadata?: Record<string, any>;
  latency_seconds?: number;
  trace_created_at?: string | Date;
  observations: Observation[];
  total_cost: number;
  total_tokens: number;
  scores: {
    id: string;
    name: string;
    value: number;
    description?: string;
    created_at?: string | Date;
  }[];
}

/* ---------- Observation Card ---------- */

function ObservationCard({ observation }: { observation: Observation }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#1c2129] rounded-lg border border-gray-800 overflow-hidden">
      {/* Header Row */}
      <div
        className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-[#242a33] transition"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex flex-col">
          <span className="font-medium text-gray-100 text-sm">
            {observation.name}
          </span>
          <span className="text-xs text-gray-400">
            {observation.type ?? "N/A"}{" "}
            {observation.start_time
              ? "• " + new Date(observation.start_time).toLocaleTimeString()
              : ""}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          {observation.total_cost !== undefined && (
            <span>${observation.total_cost?.toFixed(6)}</span>
          )}
          <ChevronRight
            size={16}
            className={`transition-transform ${expanded ? "rotate-90" : ""}`}
          />
        </div>
      </div>

      {/* Expanded Section */}
      {expanded && (
        <div className="p-4 border-t border-gray-800 text-xs space-y-4 bg-[#181c23]">
          {/* Input */}
          {observation.input && (
            <div>
              <h4 className="text-gray-400 mb-1">Input</h4>
              <pre className="bg-gray-900 p-2 rounded-md text-gray-300 overflow-auto max-h-32 whitespace-pre-wrap">
                {observation.input}
              </pre>
            </div>
          )}

          {/* Output */}
          {observation.output && (
            <div>
              <h4 className="text-gray-400 mb-1">Output</h4>
              <pre className="bg-gray-900 p-2 rounded-md text-gray-300 overflow-auto max-h-32 whitespace-pre-wrap">
                {observation.output}
              </pre>
            </div>
          )}

          {/* Metadata */}
          {observation.metadata &&
            Object.keys(observation.metadata).length > 0 && (
              <div>
                <h4 className="text-gray-400 mb-1">Metadata</h4>
                <div className="bg-gray-900 p-2 rounded-md overflow-auto max-h-32">
                  {Object.entries(observation.metadata).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between border-b border-gray-800 py-1"
                    >
                      <span className="text-gray-400">{key}</span>
                      <span className="text-gray-200">
                        {typeof value === "object"
                          ? JSON.stringify(value)
                          : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
}

/* ---------- Main Page ---------- */

export default function TracesPage() {
  const [selectedTraces, setSelectedTraces] = useState<string[]>([]);
  const [selectedTraceId, setSelectedTraceId] = useState<string | null>(null);
  const [traceDetails, setTraceDetails] = useState<TraceDetails | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [traces, setTraces] = useState<TraceSummary[]>([]);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const project_id = "7a88fb47-b4e2-43b8-a06c-a5ce950dc53a";

  const startIndex = (currentPage - 1) * rowsPerPage;
  const displayedTraces = traces.slice(startIndex, startIndex + rowsPerPage);

  /* ---------- Selection ---------- */

  const toggleSelectAll = () => {
    if (selectedTraces.length === displayedTraces.length) {
      setSelectedTraces([]);
    } else {
      setSelectedTraces(displayedTraces.map((t) => t.trace_id));
    }
  };

  const toggleSelectTrace = (id: string) => {
    setSelectedTraces((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  /* ---------- Fetch Traces ---------- */

  useEffect(() => {
    async function fetchTraces() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_BASE}/traces?project_id=${project_id}`
        );
        if (!response.ok) throw new Error("Failed to fetch traces");

        const data: TraceSummary[] = await response.json();
        setTraces(data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch traces");
      } finally {
        setLoading(false);
      }
    }

    fetchTraces();
  }, [project_id]);

  /* ---------- Fetch Trace Details ---------- */

  async function fetchTraceDetails(traceId: string) {
    try {
      setDetailLoading(true);
      setTraceDetails(null);

      const res = await fetch(
        `${API_BASE}/traces/details?project_id=${project_id}&trace_id=${traceId}`
      );
      if (!res.ok) throw new Error("Failed to fetch trace details");

      const data: TraceDetails = await res.json();
      console.log(data);
      setTraceDetails({
        ...data,
        observations: Array.isArray(data.observations) ? data.observations : [],
        scores: Array.isArray(data.scores) ? data.scores : [],
      });
    } catch (err) {
      console.error(err);
      setTraceDetails(null);
    } finally {
      setDetailLoading(false);
    }
  }

  const handleTraceClick = (traceId: string) => {
    setSelectedTraceId(traceId);
    fetchTraceDetails(traceId);
  };

  /* ---------- Render ---------- */

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-400">
        Loading traces...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );

  return (
    <div className="flex h-screen bg-[#0d1117] text-gray-100 font-inter relative">
      {/* Main Table */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Tracing Dashboard</h1>
          <div className="flex gap-2">
            <button className="flex items-center gap-1 text-sm px-3 py-1.5 bg-gray-800 rounded hover:bg-gray-700">
              <Filter size={14} /> Filter
            </button>
            <button className="flex items-center gap-1 text-sm px-3 py-1.5 bg-gray-800 rounded hover:bg-gray-700">
              <Search size={14} /> Search
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-[#0d1117] border-b border-gray-800">
              <tr>
                <th className="text-left p-3 w-10">
                  <input
                    type="checkbox"
                    checked={
                      selectedTraces.length === displayedTraces.length &&
                      displayedTraces.length > 0
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="w-10 p-3"></th>
                <th className="text-left p-3 font-medium">Timestamp</th>
                <th className="text-left p-3 font-medium">Name</th>
                <th className="text-left p-3 font-medium">Input</th>
                <th className="text-left p-3 font-medium">Output</th>
                <th className="text-right p-3 font-medium">Latency</th>
                <th className="text-right p-3 font-medium">Tokens</th>
                <th className="text-right p-3 font-medium">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {displayedTraces.map((trace, key) => (
                <tr
                  key={key}
                  onClick={() => handleTraceClick(trace.trace_id)}
                  className="border-b border-gray-800 hover:bg-gray-900/50 cursor-pointer"
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedTraces.includes(trace.trace_id)}
                      onChange={() => toggleSelectTrace(trace.trace_id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="p-3">
                    <Star
                      className={`w-4 h-4 ${
                        trace.bookmarked
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-gray-600"
                      }`}
                    />
                  </td>
                  <td className="p-3 text-gray-400">
                    {trace.timestamp
                      ? new Date(trace.timestamp).toLocaleString()
                      : "-"}
                  </td>
                  <td className="p-3">{trace.name || "-"}</td>
                  <td className="p-3 text-gray-400 max-w-sm truncate">
                    {trace.input}
                  </td>
                  <td className="p-3 text-gray-400 max-w-sm truncate">
                    {trace.output}
                  </td>
                  <td className="p-3 text-right text-gray-300">
                    {trace.latency ? `${trace.latency.toFixed(2)}s` : "-"}
                  </td>
                  <td className="p-3 text-right text-gray-300">
                    {trace.tokens || "-"}
                  </td>
                  <td className="p-3 text-right text-gray-300">
                    {trace.total_cost ? `$${trace.total_cost}` : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Drawer */}
      {selectedTraceId && (
        <div className="absolute top-0 right-0 h-full w-[600px] bg-[#161b22] border-l border-gray-800 shadow-xl animate-slideIn overflow-y-auto">
          {/* Header */}
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">
                {traceDetails?.trace_name || "Trace Details"}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {traceDetails?.trace_created_at
                  ? new Date(traceDetails.trace_created_at).toLocaleString()
                  : ""}
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedTraceId(null);
                setTraceDetails(null);
              }}
              className="p-1 hover:bg-gray-800 rounded"
            >
              <X size={18} />
            </button>
          </div>

          {/* Trace-level metrics */}
          {traceDetails && (
            <div className="p-4 border-b border-gray-800 flex flex-wrap gap-3 text-sm text-gray-300">
              {traceDetails.latency_seconds && (
                <span className="bg-gray-900 px-2 py-1 rounded-md flex items-center gap-1">
                  <Clock size={14} /> {traceDetails.latency_seconds.toFixed(2)}s
                </span>
              )}

              {traceDetails.trace_environment && (
                <span className="bg-gray-900 px-2 py-1 rounded-md flex items-center gap-1">
                  <Globe size={14} /> {traceDetails.trace_environment}
                </span>
              )}

              {traceDetails.total_tokens !== undefined && (
                <span className="bg-gray-900 px-2 py-1 rounded-md flex items-center gap-1">
                  🧮 Tokens: {traceDetails.total_tokens.toLocaleString()}
                </span>
              )}

              {traceDetails.total_cost !== undefined && (
                <span className="bg-gray-900 px-2 py-1 rounded-md flex items-center gap-1">
                  <DollarSign size={14} /> Total Cost: $
                  {traceDetails.total_cost.toFixed(6)}
                </span>
              )}

              {traceDetails.scores?.length ? (
                <span className="bg-gray-900 px-2 py-1 rounded-md flex items-center gap-1">
                  <DollarSign size={14} /> Score:{" "}
                  {traceDetails.scores[0]?.value ?? 0}
                </span>
              ) : null}
            </div>
          )}

          {/* Observations List */}
          <div className="p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase">
              Observations
            </h3>

            {Array.isArray(traceDetails?.observations) &&
            traceDetails.observations.length > 0 ? (
              traceDetails.observations.map((obs, key) => (
                <ObservationCard key={key} observation={obs} />
              ))
            ) : (
              <p className="text-gray-500 text-xs">No observations found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
