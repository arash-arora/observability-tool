"use client";

import { TraceTree, Observation } from "@/features/traces/components/TraceTree";
import { ObservationDetail } from "@/features/traces/components/ObservationDetail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Share, Download, Clock, DollarSign, Zap, Calendar, User, Tag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const mockTraceData: Observation[] = [
  {
    id: "root",
    name: "Chat Interaction",
    type: "SPAN",
    startTime: "2023-10-26 10:23:45.000",
    endTime: "2023-10-26 10:23:46.200",
    latency: "1.2s",
    cost: "$0.0024",
    status: "success",
    input: {
        messages: [
            { role: "user", content: "Hello, how are you?" }
        ]
    },
    output: {
        content: "I am an AI assistant, here to help you."
    },
    children: [
      {
        id: "retrieval",
        name: "Retrieve Context",
        type: "SPAN",
        startTime: "2023-10-26 10:23:45.050",
        endTime: "2023-10-26 10:23:45.450",
        latency: "0.4s",
        status: "success",
        input: { query: "Hello, how are you?" },
        output: { documents: [] },
        children: [
            {
                id: "embedding",
                name: "Embedding Generation",
                type: "GENERATION",
                startTime: "2023-10-26 10:23:45.050",
                endTime: "2023-10-26 10:23:45.150",
                latency: "0.1s",
                cost: "$0.0001",
                status: "success",
                input: { text: "Hello, how are you?" },
                output: { embedding: [0.1, 0.2, 0.3] }
            },
            {
                id: "db_query",
                name: "Vector DB Query",
                type: "SPAN",
                startTime: "2023-10-26 10:23:45.150",
                endTime: "2023-10-26 10:23:45.450",
                latency: "0.3s",
                status: "success",
                input: { vector: [0.1, 0.2, 0.3] },
                output: { results: [] }
            }
        ]
      },
      {
        id: "llm_call",
        name: "LLM Generation (GPT-4)",
        type: "GENERATION",
        startTime: "2023-10-26 10:23:45.500",
        endTime: "2023-10-26 10:23:46.200",
        latency: "0.7s",
        cost: "$0.0023",
        status: "success",
        input: {
            model: "gpt-4",
            messages: [{ role: "user", content: "Hello, how are you?" }]
        },
        output: {
            choices: [{ message: { content: "I am an AI assistant, here to help you." } }]
        }
      },
    ],
  },
];

export default function TraceDetailPage({ params }: { params: { traceId: string } }) {
  const [selectedObservation, setSelectedObservation] = useState<Observation | null>(null);

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
                {params.traceId || "tr_a1b2c3d4e5"}
              </Badge>
            </div>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                2025-11-21 21:09:52
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                1.63s
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                $0.000362
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
            <Badge variant="secondary">langfuse-llm-as-a-judge</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-lg font-semibold">$0.000362</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">752 → 38 tokens</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Latency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-lg font-semibold">1.63s</span>
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
              <Zap className="h-4 w-4 text-green-500" />
              <Badge variant="default" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                Success
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
                    observations={mockTraceData} 
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
