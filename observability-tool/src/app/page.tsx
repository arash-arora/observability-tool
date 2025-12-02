"use client";

import { MetricCard } from "@/features/dashboard/components/MetricCard";
import {
  Activity,
  Clock,
  DollarSign,
  Zap,
  AlertCircle,
  GitBranch,
  Workflow,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UsageTrendsChart,
  CostByModelChart,
  LatencyDistributionChart,
  QualityScoresChart,
  TokenUsageChart,
  TracesByCloudChart,
  ModelLatencyChart,
  ModelCostComparisonChart,
  AgentWorkflowChart,
  ToolUsageChart,
} from "@/features/dashboard/components/AnalyticsCharts";
import { useState, useEffect } from "react";
import {
  generateOverviewMetrics,
  generateSlowestTraces,
  generateRecentAlerts,
  generateActiveAgents,
  generateWorkflowFailures,
  generateToolPerformance,
} from "@/lib/mock-data";

export default function Home() {
  const [metrics, setMetrics] = useState<any>(null);
  const [slowestTraces, setSlowestTraces] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [activeAgents, setActiveAgents] = useState<any[]>([]);
  const [failures, setFailures] = useState<any[]>([]);
  const [toolPerf, setToolPerf] = useState<any[]>([]);

  useEffect(() => {
    setMetrics(generateOverviewMetrics());
    setSlowestTraces(generateSlowestTraces());
    setAlerts(generateRecentAlerts());
    setActiveAgents(generateActiveAgents());
    setFailures(generateWorkflowFailures());
    setToolPerf(generateToolPerformance());
  }, []);

  if (!metrics) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Analytics Dashboard
          </h2>
          <p className="text-muted-foreground mt-1">
            Monitor your LLM application performance and costs
          </p>
        </div>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="llmops" className="space-y-6">
        <TabsList>
          <TabsTrigger value="llmops">LLMOps</TabsTrigger>
          <TabsTrigger value="agentops">AgentOps</TabsTrigger>
        </TabsList>

        {/* LLMOps Tab */}
        <TabsContent value="llmops" className="space-y-8">
          {/* Overview Metrics */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Overview</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Total Traces"
                value={metrics.totalTraces}
                description="from last 30 days"
                icon={Activity}
                trend="up"
                trendValue="+23.5%"
              />
              <MetricCard
                title="Total Cost"
                value={metrics.totalCost}
                description="from last 30 days"
                icon={DollarSign}
                trend="up"
                trendValue="+12.3%"
              />
              <MetricCard
                title="Avg Latency"
                value={metrics.avgLatency}
                description="P95: 2.4s"
                icon={Clock}
                trend="down"
                trendValue="-8.2%"
              />
              <MetricCard
                title="Success Rate"
                value={metrics.successRate}
                description="from last 30 days"
                icon={Zap}
                trend="up"
                trendValue="+1.2%"
              />
            </div>
          </div>

          {/* Usage Trends */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Usage Trends</h3>
            <UsageTrendsChart />
            <div className="mt-4">
              <TracesByCloudChart />
            </div>
          </div>

          {/* Model Comparisons */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Model Comparisons</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <ModelLatencyChart />
              <ModelCostComparisonChart />
            </div>
          </div>

          {/* Cost Analysis */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Cost Analysis</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <CostByModelChart />
              <TokenUsageChart />
            </div>
          </div>

          {/* Performance Monitoring */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Performance</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <LatencyDistributionChart />
              <Card>
                <CardHeader>
                  <CardTitle>Top Slowest Traces</CardTitle>
                  <CardDescription>
                    Traces with highest latency in last 24h
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {slowestTraces.map((trace, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">{trace.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {trace.model}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-mono">
                            {trace.latency}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quality Metrics */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quality & Feedback</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <QualityScoresChart />
              <Card>
                <CardHeader>
                  <CardTitle>Recent Alerts</CardTitle>
                  <CardDescription>Issues detected in last 24h</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alerts.map((alert, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{alert.type}</p>
                          <p className="text-xs text-muted-foreground">
                            {alert.trace}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {alert.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* AgentOps Tab */}
        <TabsContent value="agentops" className="space-y-8">
          {/* Agent Overview Metrics */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Agent Overview</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Active Workflows"
                value={metrics.activeWorkflows}
                description="from last 30 days"
                icon={Workflow}
                trend="up"
                trendValue="+18.2%"
              />
              <MetricCard
                title="Total Steps"
                value={metrics.totalSteps}
                description="avg 4.8 steps/workflow"
                icon={GitBranch}
                trend="up"
                trendValue="+15.7%"
              />
              <MetricCard
                title="Tool Calls"
                value={metrics.toolCalls}
                description="from last 30 days"
                icon={Activity}
                trend="up"
                trendValue="+22.4%"
              />
              <MetricCard
                title="Success Rate"
                value={metrics.workflowSuccessRate}
                description="workflow completion"
                icon={Zap}
                trend="up"
                trendValue="+2.1%"
              />
            </div>
          </div>

          {/* Workflow Activity */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Workflow Activity</h3>
            <AgentWorkflowChart />
          </div>

          {/* Tool Usage */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tool Usage</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <ToolUsageChart />
              <Card>
                <CardHeader>
                  <CardTitle>Tool Performance</CardTitle>
                  <CardDescription>Average latency by tool</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {toolPerf.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.tool}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.status}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-mono">
                            {item.latency}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Agent Performance */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Agent Performance</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Most Active Agents</CardTitle>
                  <CardDescription>
                    By workflow count (last 7 days)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeAgents.map((agent, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">{agent.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {agent.avgSteps} avg steps
                          </p>
                        </div>
                        <span className="text-sm font-mono">
                          {agent.workflows}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Workflow Failures</CardTitle>
                  <CardDescription>Recent failed workflows</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {failures.map((failure, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {failure.workflow}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {failure.reason}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {failure.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
