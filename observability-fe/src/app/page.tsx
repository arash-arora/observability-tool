"use client"

import { useEffect, useState } from "react"
import { DashboardCard } from "@/components/DashboardCard"
import { DashboardAnalytics } from "@/components/dashboard"

export default function Dashboard() {
  const [totalTokens, setTotalTokens] = useState<number | null>(null)
  const [totalCost, setTotalCost] = useState<number | null>(null)
  const [avgLatency, setAvgLatency] = useState<number | null>(null)
  const [successRate, setSuccessRate] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  useEffect(() => {
    async function fetchDashboardMetrics() {
      try {
        setLoading(true)

        // Fetch total tokens and latency
        const [tokensRes, latencyRes, totalCostRes, successRateRes] = await Promise.all([
          fetch(`${API_BASE}/metrics/total_tokens`).then((r) => r.json()),
          fetch(`${API_BASE}/metrics/average_latency`).then((r) => r.json()),
          fetch(`${API_BASE}/metrics/total_cost`).then((r) => r.json()),
          fetch(`${API_BASE}/metrics/success_rate`).then((r) => r.json()),
        ])

        // total tokens directly from API
        setTotalTokens(tokensRes.total_tokens || 0)
        // compute average latency across all models
        setAvgLatency(latencyRes.average_latency || 0)
        setTotalCost(totalCostRes.total_cost || 0)
        setSuccessRate(successRateRes.success_rate || 0)
      } catch (err) {
        setError("Failed to fetch dashboard metrics")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardMetrics()
  }, [])

  if (loading) return <div className="p-8 text-gray-500">Loading dashboard...</div>
  if (error) return <div className="p-8 text-red-500">{error}</div>

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-5">
        <DashboardCard
          title="Total Tokens"
          value={
            totalTokens !== null
              ? `${(totalTokens / 1_000_000).toFixed(2)}M`
              : "—"
          }
          change="+15.2%"
        />
        <DashboardCard title="Total Cost" value={totalCost !== null ? `${totalCost.toFixed(2)}$` : "-"} change="+8.2%" />
        <DashboardCard
          title="Avg Latency"
          value={avgLatency !== null ? `${avgLatency}s` : "—"}
          change="-5.1%"
        />
        <DashboardCard title="Success Rate" value={successRate !== null ? `${successRate}%` : "-"} change="+0.3%" />
      </div>

      <DashboardAnalytics />
    </div>
  )
}
