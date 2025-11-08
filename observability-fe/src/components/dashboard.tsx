"use client"

import { useEffect, useState } from "react"
import { TraceVolumeChart } from "@/components/analytics/trace-volume-chart"
import { TokenUsage } from "@/components/analytics/token-usage"
import { LatencyByModel } from "@/components/analytics/latency-by-model"

type TraceVolume = { time: string; traces: number }
type TokenUsageType = {
  model: string
  input_tokens: number
  output_tokens: number
  total_tokens: number
}
type LatencyType = { model: string; avg_latency: number; requests: number }

export function DashboardAnalytics() {
  const [traceData, setTraceData] = useState<TraceVolume[]>([])
  const [tokenData, setTokenData] = useState<TokenUsageType[]>([])
  const [latencyData, setLatencyData] = useState<LatencyType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  useEffect(() => {
    async function fetchMetrics() {
      try {
        setLoading(true)
        const [trace, token, latency] = await Promise.all([
          fetch(`${API_BASE}/metrics/trace_volume`).then((r) => {console.log(r); return r.json()}),
          fetch(`${API_BASE}/metrics/token_usage`).then((r) => r.json()),
          fetch(`${API_BASE}/metrics/latency_by_model`).then((r) => r.json()),
        ])
        const normalizedTokenData = token.map((t: any) => ({
          model: t.model,
          input_tokens: t.input_tokens ?? t.prompt ?? 0,
          output_tokens: t.output_tokens ?? t.completion ?? 0,
          total_tokens: t.total_tokens ?? t.total ?? 0,
        }))

        setTraceData(trace)
        setTokenData(normalizedTokenData)
        setLatencyData(latency)
      } catch (err) {
        setError("Failed to fetch metrics")
      } finally {
        setLoading(false)
      }
    }
    fetchMetrics()
  }, [])

  if (loading) return <div className="p-8 text-gray-500">Loading metrics...</div>
  if (error) return <div className="p-8 text-red-500">{error}</div>

  return (
    <div className="space-y-6">
      <TraceVolumeChart data={traceData} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TokenUsage data={tokenData} />
        <LatencyByModel data={latencyData} />
      </div>
    </div>
  )
}
