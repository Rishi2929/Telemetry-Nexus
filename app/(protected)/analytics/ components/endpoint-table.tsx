"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Network, Terminal, ChevronLeft, ChevronRight } from "lucide-react";

type EndpointData = {
  endpoint: string;
  requests: number;
  errors: number;
  averageLatency: number;
};

type EndpointTableProps = {
  data: EndpointData[];
  itemsPerPage?: number;
};

export function EndpointTable({ data, itemsPerPage = 10 }: EndpointTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <Card className="relative overflow-hidden border border-border/80 bg-card/95 backdrop-blur-md shadow-xl font-sans text-left">
      <ComponentHeader count={data.length} />

      <CardContent className="p-0">
        {data.length === 0 ? (
          <EmptyEndpointsState />
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30 font-mono text-[11px] uppercase tracking-wider">
                  <TableRow className="border-border/60 hover:bg-transparent">
                    <TableHead className="text-muted-foreground font-semibold py-3 pl-5">Endpoint</TableHead>
                    <TableHead className="text-muted-foreground font-semibold py-3">Total Requests</TableHead>
                    <TableHead className="text-muted-foreground font-semibold py-3">Errors</TableHead>
                    <TableHead className="text-muted-foreground font-semibold py-3">Error Rate</TableHead>
                    <TableHead className="text-muted-foreground font-semibold py-3 pr-5 text-right">Avg Latency</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody className="font-mono text-xs">
                  {paginatedData.map((item) => (
                    <EndpointRow key={item.endpoint} data={item} />
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between border-t border-border/60 bg-muted/20 px-5 py-3 font-mono text-xs">
              <span className="text-muted-foreground text-[11px]">
                Showing <span className="font-semibold text-foreground">{data.length > 0 ? startIndex + 1 : 0}</span>-
                <span className="font-semibold text-foreground">{Math.min(startIndex + itemsPerPage, data.length)}</span> of{" "}
                <span className="font-semibold text-foreground">{data.length}</span> routes
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-7 px-2 border-border/60 bg-muted/20 text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground disabled:opacity-40"
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                  Prev
                </Button>

                <span className="text-[11px] text-muted-foreground px-1">
                  Page <span className="font-semibold text-foreground">{currentPage}</span> of{" "}
                  <span className="font-semibold text-foreground">{totalPages}</span>
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-7 px-2 border-border/60 bg-muted/20 text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

{
  /* Sub-Components */
}

function ComponentHeader({ count }: { count: number }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-border/60 bg-muted/20">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <Network className="h-3.5 w-3.5" />
          </div>
          <h2 className="text-base font-extrabold tracking-tight text-foreground font-sans">Endpoint Performance</h2>
          <Badge
            variant="outline"
            className="font-mono text-[9px] px-1.5 py-0 border-emerald-500/30 text-emerald-400 bg-emerald-500/10 h-4"
          >
            {count} ROUTES
          </Badge>
        </div>
        <p className="text-xs font-mono text-muted-foreground">Traffic distribution, exception rates, and latency per route.</p>
      </div>
    </div>
  );
}

function EndpointRow({ data }: { data: EndpointData }) {
  const errorRate = data.requests > 0 ? (data.errors / data.requests) * 100 : 0;
  const roundedLatency = Math.round(data.averageLatency);

  const parts = data.endpoint.trim().split(" ");
  const hasMethod = parts.length > 1 && ["GET", "POST", "PUT", "DELETE", "PATCH"].includes(parts[0].toUpperCase());
  const method = hasMethod ? parts[0].toUpperCase() : null;
  const path = hasMethod ? parts.slice(1).join(" ") : data.endpoint;

  return (
    <TableRow className="border-border/40 hover:bg-muted/30 transition-colors">
      <TableCell className="py-3 pl-5 font-semibold text-foreground">
        <div className="flex items-center gap-2">
          {method && <MethodBadge method={method} />}
          <span className="truncate max-w-[280px] sm:max-w-xs">{path}</span>
        </div>
      </TableCell>

      <TableCell className="py-3 text-muted-foreground">{data.requests.toLocaleString()}</TableCell>

      <TableCell className="py-3">
        <span className={data.errors > 0 ? "text-amber-400 font-bold" : "text-muted-foreground"}>{data.errors.toLocaleString()}</span>
      </TableCell>

      <TableCell className="py-3">
        <Badge
          variant="outline"
          className={`font-mono text-[10px] px-1.5 py-0 border-none ${
            errorRate >= 5
              ? "bg-rose-500/10 text-rose-400"
              : errorRate > 0
                ? "bg-amber-500/10 text-amber-400"
                : "bg-emerald-500/10 text-emerald-400"
          }`}
        >
          {errorRate.toFixed(1)}%
        </Badge>
      </TableCell>

      <TableCell className="py-3 pr-5 text-right">
        <span
          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-mono border ${
            roundedLatency >= 500
              ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
              : roundedLatency >= 250
                ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
          }`}
        >
          {roundedLatency} ms
        </span>
      </TableCell>
    </TableRow>
  );
}

function MethodBadge({ method }: { method: string }) {
  const methodColors: Record<string, string> = {
    GET: "border-sky-500/30 text-sky-400 bg-sky-500/10",
    POST: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
    PUT: "border-amber-500/30 text-amber-400 bg-amber-500/10",
    DELETE: "border-rose-500/30 text-rose-400 bg-rose-500/10",
    PATCH: "border-purple-500/30 text-purple-400 bg-purple-500/10",
  };

  return (
    <span
      className={`px-1.5 py-0.2 rounded font-mono text-[9px] font-bold border ${
        methodColors[method] ?? "border-border text-muted-foreground"
      }`}
    >
      {method}
    </span>
  );
}

function EmptyEndpointsState() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-2 font-mono">
      <Terminal className="h-6 w-6 text-muted-foreground/60" />
      <p className="text-xs text-muted-foreground">No telemetry routes recorded yet.</p>
    </div>
  );
}
