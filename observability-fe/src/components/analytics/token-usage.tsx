"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

type TokenData = {
  model: string
  input_tokens: number
  output_tokens: number
  total_tokens: number
}

export function TokenUsage({ data }: { data: TokenData[] }) {
  // const top5Data = [...data]
  //   .sort((a, b) => b.total_tokens - a.total_tokens)
  //   .slice(0, 5)

  const formatToMillions = (value: number) =>
    `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 2 : 3)}M`

  const truncate = (name: string) =>
    name.length > 12 ? name.slice(0, 12) + "…" : name

  // ✨ Custom minimalist tooltip
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
              {formatToMillions(entry.value)}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Consumption (per Model)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 100,
              }}
              barCategoryGap="20%"
            >
              <XAxis
                dataKey="model"
                interval={0}
                tick={{
                  fontSize: 12,
                  textAnchor: "end",
                }}
                angle={-25}
                tickFormatter={truncate}
              />
              <YAxis tickFormatter={formatToMillions} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{
                  paddingTop: "40px",
                }}
              />
              <Bar dataKey="input_tokens" stackId="a" fill="#60a5fa" name="Input Tokens" />
              <Bar dataKey="output_tokens" stackId="a" fill="#34d399" name="Output Tokens" />
              <Bar dataKey="total_tokens" fill="#fbbf24" name="Total Tokens" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
