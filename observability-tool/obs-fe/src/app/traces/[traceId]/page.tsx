"use client";

import { TraceTree, Observation, ObservationType } from "@/features/traces/components/TraceTree";
import { ObservationDetail } from "@/features/traces/components/ObservationDetail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Share, Download, Clock, DollarSign, Zap, Calendar, User, Tag } from "lucide-react";
import Link from "next/link";
import { useState, use, useEffect } from "react";
import { apiClient, type TraceDetailResponse, type ObservationResponse } from "@/lib/api-client";

// Transform API observation to component observation format
function transformObservation(obs: ObservationResponse): Observation {
  return {
    id: obs.id,
    name: obs.name,
    type: (obs.type as ObservationType) || "SPAN",
    startTime: obs.start_time || "",
    endTime: obs.end_time || "",
    latency: obs.latency || "0s",
    cost: obs.cost,
    status: (obs.status === "error" ? "error" : "success"),
    input: obs.input,
    output: obs.output,
    children: obs.children?.map(transformObservation) || []
  };
}

export default function TraceDetailPage({ params }: { params: Promise<{ traceId: string }> }) {
  const { traceId } = use(params);
  const [selectedObservation, setSelectedObservation] = useState<Observation | null>(null);
  const [traceData, setTraceData] = useState<TraceDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrace = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getTraceById(traceId);
        setTraceData(data);
      } catch (error) {
        console.error("Failed to fetch trace:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrace();
  }, [traceId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading trace...</p>
      </div>
    );
  }

  if (!traceData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Trace not found</p>
      </div>
    );
  }

  const observations = traceData.observations.map(transformObservation);

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/traces">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight">Trace</h2>
              <Badge variant="outline" className="font-mono text-xs">
                {traceId}
              </Badge>
            </div>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {traceData.timestamp}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {traceData.latency || 'N/A'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {traceData.cost || 'N/A'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Metadata Cards */}
      <div className="grid grid-cols-4 gap-4 shrink-0">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Environment</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">{traceData.environment || 'default'}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-lg font-semibold">{traceData.cost || '$0.00'}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{traceData.tokens || 'N/A'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Latency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-lg font-semibold">{traceData.latency || 'N/A'}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">P95: 2.4s</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Zap className={`h-4 w-4 ${traceData.status === 'success' ? 'text-green-500' : 'text-red-500'}`} />
              <Badge 
                variant="default" 
                className={traceData.status === 'success' 
                  ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" 
                  : "bg-red-500/10 text-red-500 hover:bg-red-500/20"}
              >
                {traceData.status.charAt(0).toUpperCase() + traceData.status.slice(1)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="timeline" className="flex-1 flex flex-col overflow-hidden">
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="logs">Log View</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="flex-1 overflow-hidden mt-4">
          <div className="flex-1 overflow-hidden flex gap-4 h-full">
            <div className="flex-1 overflow-hidden">
              <Card className="h-full overflow-hidden flex flex-col">
                <CardHeader>
                  <CardTitle>Trace Timeline</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto">
                  <TraceTree 
                    observations={observations} 
                    onSelectObservation={setSelectedObservation}
                    selectedId={selectedObservation?.id}
                  />
                </CardContent>
              </Card>
            </div>
            <div className="w-[420px] shrink-0 overflow-hidden">
              <ObservationDetail observation={selectedObservation} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="flex-1 overflow-hidden mt-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Execution Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 font-mono text-xs">
                <div className="text-muted-foreground">[2025-11-21 21:09:52.123] Starting trace execution...</div>
                <div className="text-muted-foreground">[2025-11-21 21:09:52.145] Initializing LLM evaluator</div>
                <div className="text-muted-foreground">[2025-11-21 21:09:52.890] Sending request to model: gpt-4</div>
                <div className="text-green-500">[2025-11-21 21:09:54.523] ✓ Response received successfully</div>
                <div className="text-muted-foreground">[2025-11-21 21:09:54.550] Processing evaluation results</div>
                <div className="text-green-500">[2025-11-21 21:09:54.753] ✓ Trace completed successfully</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metadata" className="flex-1 overflow-hidden mt-4">
          <Card className="h-full overflow-auto">
            <CardHeader>
              <CardTitle>Trace Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Tags
                  </h4>
                  <div className="flex gap-2">
                    <Badge variant="secondary">evaluator</Badge>
                    <Badge variant="secondary">error-analysis</Badge>
                    <Badge variant="secondary">production</Badge>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    User Information
                  </h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">User ID:</span>
                      <span className="font-mono">user_abc123</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Session ID:</span>
                      <span className="font-mono">session_xyz789</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2">Custom Metadata</h4>
                  <div className="bg-muted/50 rounded-md p-3 font-mono text-xs">
                    <pre>{JSON.stringify({
                      version: "1.0.0",
                      environment: "langfuse-llm-as-a-judge",
                      model: "gpt-4",
                      temperature: 0.7,
                      max_tokens: 150
                    }, null, 2)}</pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
