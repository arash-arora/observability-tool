"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const usageData = [
  { date: "Jan 1", traces: 420, generations: 280, spans: 140 },
  { date: "Jan 8", traces: 580, generations: 390, spans: 190 },
  { date: "Jan 15", traces: 720, generations: 480, spans: 240 },
  { date: "Jan 22", traces: 650, generations: 430, spans: 220 },
  { date: "Jan 29", traces: 890, generations: 590, spans: 300 },
  { date: "Feb 5", traces: 1020, generations: 680, spans: 340 },
  { date: "Feb 12", traces: 950, generations: 630, spans: 320 },
];

const costData = [
  { model: "gpt-4", cost: 450, tokens: 1200000 },
  { model: "gpt-3.5-turbo", cost: 120, tokens: 3500000 },
  { model: "claude-2", cost: 280, tokens: 950000 },
  { model: "claude-instant", cost: 85, tokens: 2100000 },
];

const latencyData = [
  { range: "0-0.5s", count: 3200 },
  { range: "0.5-1s", count: 4500 },
  { range: "1-2s", count: 2800 },
  { range: "2-3s", count: 1200 },
  { range: "3-5s", count: 450 },
  { range: "5s+", count: 180 },
];

const qualityData = [
  { date: "Week 1", userScore: 4.2, aiScore: 4.5 },
  { date: "Week 2", userScore: 4.3, aiScore: 4.4 },
  { date: "Week 3", userScore: 4.5, aiScore: 4.6 },
  { date: "Week 4", userScore: 4.4, aiScore: 4.7 },
];

const tokenData = [
  { date: "Jan 1", input: 450000, output: 280000 },
  { date: "Jan 8", input: 580000, output: 390000 },
  { date: "Jan 15", input: 720000, output: 480000 },
  { date: "Jan 22", input: 650000, output: 430000 },
  { date: "Jan 29", input: 890000, output: 590000 },
  { date: "Feb 5", input: 1020000, output: 680000 },
  { date: "Feb 12", input: 950000, output: 630000 },
];

const modelLatencyData = [
  { model: "gpt-4", p50: 1.2, p95: 2.4, p99: 3.8 },
  { model: "gpt-3.5-turbo", p50: 0.6, p95: 1.2, p99: 1.8 },
  { model: "claude-2", p50: 1.5, p95: 2.8, p99: 4.2 },
  { model: "claude-instant", p50: 0.8, p95: 1.5, p99: 2.1 },
];

const modelCostComparisonData = [
  { model: "gpt-4", costPerRequest: 0.035, costPer1kTokens: 0.03 },
  { model: "gpt-3.5-turbo", costPerRequest: 0.003, costPer1kTokens: 0.002 },
  { model: "claude-2", costPerRequest: 0.028, costPer1kTokens: 0.024 },
  { model: "claude-instant", costPerRequest: 0.004, costPer1kTokens: 0.003 },
];

const agentWorkflowData = [
  { date: "Jan 1", workflows: 120, steps: 580, tools: 340 },
  { date: "Jan 8", workflows: 150, steps: 720, tools: 420 },
  { date: "Jan 15", workflows: 180, steps: 860, tools: 510 },
  { date: "Jan 22", workflows: 165, steps: 790, tools: 470 },
  { date: "Jan 29", workflows: 210, steps: 1010, tools: 600 },
];

const toolUsageData = [
  { tool: "web_search", count: 1250, avgLatency: 2.3 },
  { tool: "code_executor", count: 890, avgLatency: 1.8 },
  { tool: "database_query", count: 650, avgLatency: 0.9 },
  { tool: "api_call", count: 1100, avgLatency: 1.5 },
];

export function UsageTrendsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trace Activity Over Time</CardTitle>
        <CardDescription>Daily trace counts by type</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={usageData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px"
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="traces" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="generations" stroke="#10b981" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="spans" stroke="#f59e0b" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function CostByModelChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost by Model</CardTitle>
        <CardDescription>Total spend per model (last 30 days)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={costData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="model"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px"
              }}
              formatter={(value) => `$${value}`}
            />
            <Bar dataKey="cost" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function LatencyDistributionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latency Distribution</CardTitle>
        <CardDescription>Response time breakdown (last 7 days)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={latencyData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
            <XAxis
              type="number"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="range"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px"
              }}
            />
            <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function QualityScoresChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quality Scores</CardTitle>
        <CardDescription>User feedback vs AI evaluation scores</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={qualityData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, 5]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px"
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="userScore" stroke="hsl(var(--primary))" strokeWidth={2} name="User Feedback" />
            <Line type="monotone" dataKey="aiScore" stroke="#f59e0b" strokeWidth={2} name="AI Evaluation" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function TokenUsageChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Usage</CardTitle>
        <CardDescription>Input vs output tokens over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={tokenData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px"
              }}
              formatter={(value) => value.toLocaleString()}
            />
            <Legend />
            <Bar dataKey="input" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Input Tokens" />
            <Bar dataKey="output" fill="#10b981" radius={[4, 4, 0, 0]} name="Output Tokens" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ModelLatencyChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Latency Comparison</CardTitle>
        <CardDescription>P50, P95, P99 latency by model</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={modelLatencyData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="model"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}s`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px"
              }}
              formatter={(value) => `${value}s`}
            />
            <Legend />
            <Bar dataKey="p50" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="P50" />
            <Bar dataKey="p95" fill="#10b981" radius={[4, 4, 0, 0]} name="P95" />
            <Bar dataKey="p99" fill="#f59e0b" radius={[4, 4, 0, 0]} name="P99" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ModelCostComparisonChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Cost Comparison</CardTitle>
        <CardDescription>Cost per request vs cost per 1k tokens</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={modelCostComparisonData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="model"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px"
              }}
              formatter={(value) => `$${value}`}
            />
            <Legend />
            <Bar dataKey="costPerRequest" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Cost/Request" />
            <Bar dataKey="costPer1kTokens" fill="#10b981" radius={[4, 4, 0, 0]} name="Cost/1k Tokens" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function AgentWorkflowChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Workflow Activity</CardTitle>
        <CardDescription>Workflows, steps, and tool calls over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={agentWorkflowData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px"
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="workflows" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="steps" stroke="#10b981" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="tools" stroke="#f59e0b" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ToolUsageChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tool Usage & Performance</CardTitle>
        <CardDescription>Most used tools and their average latency</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={toolUsageData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="tool"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px"
              }}
            />
            <Legend />
            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Usage Count" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
