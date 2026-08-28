"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Gauge, AlertTriangle, Layers, ChevronLeft, ChevronRight } from "lucide-react";

type EndpointStats = {
  endpoint: string;
  requests: number;
  errors: number;
  averageLatency: number;
};

type Props = {
  endpoints: EndpointStats[];
  pageSize?: number;
};

export function EndpointTable({ endpoints, pageSize = 10 }: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(endpoints.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentEndpoints = endpoints.slice(startIndex, startIndex + pageSize);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <Card className="border border-border/80 bg-card/95 backdrop-blur-md shadow-xl font-sans text-left">
      <TableHeaderSection totalEndpoints={endpoints.length} />

      <CardContent className="p-0">
        <div className="w-full overflow-x-auto">
          <Table className="font-mono text-xs">
            <TableHeader className="bg-muted/30 border-b border-border/60">
              <TableRow className="hover:bg-transparent border-border/60">
                <TableHead className="text-zinc-400 font-semibold uppercase tracking-wider py-3">Target Endpoint</TableHead>
                <TableHead className="text-zinc-400 font-semibold uppercase tracking-wider py-3 text-right">Requests</TableHead>
                <TableHead className="text-zinc-400 font-semibold uppercase tracking-wider py-3 text-right">Errors</TableHead>
                <TableHead className="text-zinc-400 font-semibold uppercase tracking-wider py-3 text-right">Avg Latency</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-border/40">
              {endpoints.length === 0 ? <EmptyStateRow /> : currentEndpoints.map((item) => <EndpointRow key={item.endpoint} item={item} />)}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Pagination Footer */}
      {endpoints.length > 0 && (
        <CardFooter className="flex items-center justify-between border-t border-border/60 bg-muted/20 px-5 py-3 font-mono text-xs">
          <p className="text-[11px] text-muted-foreground">
            Showing <span className="text-foreground font-semibold">{startIndex + 1}</span>–
            <span className="text-foreground font-semibold">{Math.min(startIndex + pageSize, endpoints.length)}</span> of{" "}
            <span className="text-foreground font-semibold">{endpoints.length}</span> endpoints
          </p>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground mr-2">
              Page <span className="text-foreground font-semibold">{currentPage}</span> of{" "}
              <span className="text-foreground font-semibold">{totalPages}</span>
            </span>

            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="h-7 w-7 border-border/80 bg-zinc-900/60 hover:bg-zinc-800 disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="h-7 w-7 border-border/80 bg-zinc-900/60 hover:bg-zinc-800 disabled:opacity-40"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

/* Sub-Components */

function TableHeaderSection({ totalEndpoints }: { totalEndpoints: number }) {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-border/60 bg-muted/20">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-emerald-400" />
        <h2 className="text-sm font-extrabold tracking-tight text-foreground font-sans">Endpoint Performance Metrics</h2>
      </div>

      <Badge variant="outline" className="font-mono text-[9px] px-1.5 py-0 border-emerald-500/30 text-emerald-400 bg-emerald-500/10 h-4">
        {totalEndpoints} MONITORED
      </Badge>
    </div>
  );
}

function EndpointRow({ item }: { item: EndpointStats }) {
  const hasErrors = item.errors > 0;
  const isHighLatency = item.averageLatency > 300;
  const isMedLatency = item.averageLatency > 150 && !isHighLatency;

  return (
    <TableRow className="hover:bg-muted/20 transition-colors border-border/40">
      <TableCell className="py-3">
        <span className="rounded bg-zinc-800/80 px-2 py-1 text-zinc-200 border border-border/40 font-mono text-xs">{item.endpoint}</span>
      </TableCell>

      <TableCell className="text-right py-3 font-bold text-zinc-200">{item.requests.toLocaleString()}</TableCell>

      <TableCell className="text-right py-3">
        {hasErrors ? (
          <span className="text-rose-400 font-bold flex items-center justify-end gap-1">
            <AlertTriangle className="h-3 w-3" />
            {item.errors.toLocaleString()}
          </span>
        ) : (
          <span className="text-zinc-500">0</span>
        )}
      </TableCell>

      <TableCell className="text-right py-3">
        <div className="flex items-center justify-end gap-1.5">
          <Gauge className={`h-3 w-3 ${isHighLatency ? "text-rose-400" : isMedLatency ? "text-amber-400" : "text-emerald-400"}`} />
          <span className={`font-bold ${isHighLatency ? "text-rose-400" : isMedLatency ? "text-amber-400" : "text-emerald-400"}`}>
            {item.averageLatency.toFixed(0)} ms
          </span>
        </div>
      </TableCell>
    </TableRow>
  );
}

function EmptyStateRow() {
  return (
    <TableRow>
      <TableCell colSpan={4} className="h-28 text-center text-muted-foreground font-mono">
        <div className="flex flex-col items-center justify-center gap-1">
          <Layers className="h-5 w-5 text-zinc-600 mb-1" />
          <span>No endpoint telemetry recorded for this timeframe.</span>
        </div>
      </TableCell>
    </TableRow>
  );
}
