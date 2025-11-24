"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Search, Filter, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useState } from "react";

const traces = [
  {
    id: "tr_a1b2c3d4e5",
    timestamp: "2025-11-21 21:09:52",
    name: "Execute evaluator: error-analysis",
    input: "The agent may only answer questions related to Langfuse or the br...",
    output: '{"reasoning":"The answer is fully focused on Langfuse and...',
    latency: "1.63s",
    cost: "$0.000362",
    tokens: "752 → 38",
    status: "success",
    environment: "langfuse-llm-as-a-judge",
  },
  {
    id: "tr_f6g7h8i9j0",
    timestamp: "2025-11-21 21:09:51",
    name: "Execute evaluator: is_question",
    input: "Is the following user message a question?\\n\\nWhat can I use Langf...",
    output: '{"reasoning":"The user message is phrased as a question...',
    latency: "1.52s",
    cost: "$0.000341",
    tokens: "698 → 35",
    status: "success",
    environment: "default",
  },
  {
    id: "tr_k1l2m3n4o5",
    timestamp: "2025-11-21 21:09:51",
    name: "Execute evaluator: helpfulness",
    input: "Evaluate the helpfulness of the generation on a continuous scale fr...",
    output: '{"reasoning":"The generation directly repeats the user\'s q...',
    latency: "1.48s",
    cost: "$0.000328",
    tokens: "665 → 32",
    status: "success",
    environment: "sdk-experiment",
  },
  {
    id: "tr_p6q7r8s9t0",
    timestamp: "2025-11-21 21:09:50",
    name: "Execute evaluator: is_same_language",
    input: "Are these two languages the same?\\n\\n## Text 1\\n\\nWhat can I use ...",
    output: '{"reasoning":"Text 1 is a question in English, and Text 2 is...',
    latency: "1.41s",
    cost: "$0.000315",
    tokens: "642 → 30",
    status: "success",
    environment: "default",
  },
  {
    id: "tr_u1v2w3x4y5",
    timestamp: "2025-11-21 21:09:31",
    name: "Execute evaluator: contains_pii",
    input: "Does this text contain any PII (personal identifiable information)?\\n\\n...",
    output: '{"reasoning":"No PII is present in the text", "score":0}',
    latency: "1.38s",
    cost: "$0.000298",
    tokens: "615 → 28",
    status: "success",
    environment: "default",
  },
  {
    id: "tr_z6a7b8c9d0",
    timestamp: "2025-11-21 21:09:00",
    name: "QA-Chatbot",
    input: "What can I use Langfuse for?",
    output: "# What you can use Langfuse for - Observability (tracing in ...",
    latency: "2.15s",
    cost: "$0.001245",
    tokens: "1250 → 180",
    status: "success",
    environment: "production",
  },
  {
    id: "tr_e1f2g3h4i5",
    timestamp: "2025-11-21 20:41:09",
    name: "Execute evaluator: error-analysis",
    input: "The agent may only answer questions related to Langfuse or the br...",
    output: '{"reasoning":"The answer is fully focused on Langfuse and...',
    latency: "1.55s",
    cost: "$0.000352",
    tokens: "740 → 36",
    status: "error",
    environment: "langfuse-llm-as-a-judge",
  },
  {
    id: "tr_j6k7l8m9n0",
    timestamp: "2025-11-21 20:41:08",
    name: "Execute evaluator: helpfulness",
    input: "Evaluate the helpfulness of the generation on a continuous scale fr...",
    output: '{"reasoning":"The generation is comprehensive and helpful...',
    latency: "1.62s",
    cost: "$0.000368",
    tokens: "765 → 39",
    status: "success",
    environment: "sdk-experiment",
  },
];

export default function TracesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tracing</h2>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="traces" className="space-y-4">
        <TabsList>
          <TabsTrigger value="traces">Traces</TabsTrigger>
          <TabsTrigger value="observations">Observations</TabsTrigger>
        </TabsList>

        <TabsContent value="traces" className="space-y-4">
          {/* Filters and Search Bar */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Hide filters
            </Button>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="sm">
              IDs / Names
            </Button>
            <Button variant="outline" size="sm">
              1d
            </Button>
            <Button variant="outline" size="sm">
              Past 1 day
            </Button>
            <Button variant="outline" size="sm">
              Saved Views
            </Button>
            <Button variant="outline" size="sm">
              Columns 20/32
            </Button>
          </div>

          {/* Table */}
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-border">
                  <TableHead className="w-[40px]">
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </TableHead>
                  <TableHead className="font-semibold">Timestamp ▼</TableHead>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Input</TableHead>
                  <TableHead className="font-semibold">Output</TableHead>
                  <TableHead className="font-semibold text-right">Latency</TableHead>
                  <TableHead className="font-semibold text-right">Cost</TableHead>
                  <TableHead className="font-semibold text-right">Tokens</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {traces.map((trace) => (
                  <TableRow 
                    key={trace.id} 
                    className="hover:bg-muted/50 cursor-pointer border-b border-border/50"
                  >
                    <TableCell>
                      <Star className="h-4 w-4 text-muted-foreground hover:text-primary" />
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {trace.timestamp}
                    </TableCell>
                    <TableCell>
                      <Link 
                        href={`/traces/${trace.id}`} 
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {trace.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs font-normal">
                          Env: {trace.environment}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <p className="text-sm text-muted-foreground truncate">
                        {trace.input}
                      </p>
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <p className="text-sm text-muted-foreground truncate">
                        {trace.output}
                      </p>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {trace.latency}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {trace.cost}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm text-muted-foreground">
                      {trace.tokens}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page</span>
              <Button variant="outline" size="sm">
                {rowsPerPage}
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of 7
              </span>
              <div className="flex items-center gap-1">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <ChevronLeft className="h-4 w-4 -ml-3" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(Math.min(7, currentPage + 1))}
                  disabled={currentPage === 7}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(7)}
                  disabled={currentPage === 7}
                >
                  <ChevronRight className="h-4 w-4" />
                  <ChevronRight className="h-4 w-4 -ml-3" />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="observations">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Observations view coming soon...</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
