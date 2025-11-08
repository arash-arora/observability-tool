"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts"

type LatencyModelData = {
  model: string
  avg_latency: number
  requests: number
}

export function LatencyByModel({ data }: { data: LatencyModelData[] }) {

  const truncate = (name: string) =>
    name.length > 12 ? name.slice(0, 12) + "…" : name

  // Custom minimalist tooltip (same style as TokenUsage)
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null

    return (
      <div
        className="rounded-xl border border-border/40 bg-[hsl(var(--card))]/90 backdrop-blur-md shadow-sm px-3 py-2"
      >
        <p className="text-sm font-medium text-[hsl(var(--foreground))] mb-1">
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <div
            key={`item-${index}`}
            className="flex justify-between text-xs text-[hsl(var(--muted-foreground))]"
          >
            <span className="capitalize">{entry.name}</span>
            <span className="font-medium text-[hsl(var(--foreground))]">
              {entry.value.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Efficiency Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 20, right: 40, left: 20, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey="model"
                tick={{ fontSize: 12, textAnchor: "end" }}
                angle = {-25}
                tickFormatter={truncate}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 12 }}
                label={{
                  value: "Avg Latency (s)",
                  angle: -90,
                  position: "insideLeft",
                  offset: 0,
                  style: { fontSize: 12 },
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
                label={{
                  value: "Requests",
                  angle: 90,
                  position: "insideRight",
                  style: { fontSize: 12 },
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{
                  paddingTop: "40px",
                }}
              />

              {/* Bar for Request Count */}
              <Bar
                yAxisId="right"
                dataKey="requests"
                fill="#60a5fa"
                name="Requests"
                barSize={28}
                radius={[4, 4, 0, 0]}
              />

              {/* Line for Average Latency */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="avg_latency"
                stroke="#fbbf24"
                strokeWidth={3}
                name="Avg Latency (s)"
                dot={{ r: 4, fill: "#fbbf24", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#fbbf24", strokeWidth: 0 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
