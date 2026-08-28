"use client";

import { useState, useMemo } from "react";
import { ApiLog } from "@/app/generated/prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MethodBadge } from "./method-badge";
import { StatusBadge } from "./status-badge";
import { LevelBadge } from "./levelBadge";
import { Terminal, Layers, Clock, Search, ChevronLeft, ChevronRight, X } from "lucide-react";

type Props = {
  logs: ApiLog[];
  pageSize?: number;
};

export function LogsTable({ logs, pageSize = 10 }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter logs based on search string
  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) return logs;

    const query = searchQuery.toLowerCase().trim();
    return logs.filter((log) => {
      return (
        log.endpoint.toLowerCase().includes(query) ||
        log.method.toLowerCase().includes(query) ||
        log.level.toLowerCase().includes(query) ||
        log.statusCode.toString().includes(query) ||
        (log.message && log.message.toLowerCase().includes(query))
      );
    });
  }, [logs, searchQuery]);

  // Reset page to 1 whenever search query changes
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  // Pagination bounds
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + pageSize);

  return (
    <Card className="border border-border/80 bg-card/95 backdrop-blur-md shadow-xl font-sans text-left">
      <TableHeaderSection
        totalLogs={logs.length}
        filteredCount={filteredLogs.length}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      <CardContent className="p-0">
        <div className="w-full overflow-x-auto">
          <Table className="font-mono text-xs">
            <TableHeader className="bg-muted/30 border-b border-border/60">
              <TableRow className="hover:bg-transparent border-border/60">
                <TableHead className="text-zinc-400 font-semibold uppercase tracking-wider py-3 min-w-[130px]">Timestamp</TableHead>
                <TableHead className="text-zinc-400 font-semibold uppercase tracking-wider py-3">Level</TableHead>
                <TableHead className="text-zinc-400 font-semibold uppercase tracking-wider py-3">Method</TableHead>
                <TableHead className="text-zinc-400 font-semibold uppercase tracking-wider py-3">Endpoint</TableHead>
                <TableHead className="text-zinc-400 font-semibold uppercase tracking-wider py-3">Status</TableHead>
                <TableHead className="text-zinc-400 font-semibold uppercase tracking-wider py-3 text-right">Latency</TableHead>
                <TableHead className="text-zinc-400 font-semibold uppercase tracking-wider py-3 min-w-[200px]">Message</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-border/40">
              {paginatedLogs.length === 0 ? (
                <EmptyStateRow isFiltered={searchQuery.length > 0} />
              ) : (
                paginatedLogs.map((log) => <LogRow key={log.id} log={log} />)
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer Controls */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredLogs.length}
          startIndex={startIndex}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </CardContent>
    </Card>
  );
}

/* Sub-Components */

type HeaderProps = {
  totalLogs: number;
  filteredCount: number;
  searchQuery: string;
  onSearchChange: (val: string) => void;
};

function TableHeaderSection({ totalLogs, filteredCount, searchQuery, onSearchChange }: HeaderProps) {
  return (
    <div className="flex flex-col gap-3 px-5 py-3.5 border-b border-border/60 bg-muted/20 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Terminal className="h-4 w-4 text-emerald-400" />
        <h2 className="text-sm font-extrabold tracking-tight text-foreground font-sans">Live Log Stream</h2>
        <Badge
          variant="outline"
          className="font-mono text-[9px] px-1.5 py-0 border-emerald-500/30 text-emerald-400 bg-emerald-500/10 h-4 ml-1"
        >
          {filteredCount === totalLogs ? `${totalLogs} RECORDS` : `${filteredCount}/${totalLogs} FILTERED`}
        </Badge>
      </div>

      {/* Search Bar Input */}
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
        <Input
          type="text"
          placeholder="Filter endpoint, method, status..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-8 pl-8 pr-8 font-mono text-xs bg-zinc-900/60 border-border/60 focus-visible:ring-emerald-500/40 text-zinc-200 placeholder:text-zinc-500"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

function LogRow({ log }: { log: ApiLog }) {
  const isSlow = log.latency > 300;
  const isModerate = log.latency > 150 && !isSlow;

  const formattedTime = new Date(log.createdAt).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <TableRow className="hover:bg-muted/20 transition-colors border-border/40">
      <TableCell className="py-2.5 text-zinc-400">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3 w-3 text-zinc-500" />
          <span>{formattedTime}</span>
        </div>
      </TableCell>

      <TableCell className="py-2.5">
        <LevelBadge level={log.level} />
      </TableCell>

      <TableCell className="py-2.5">
        <MethodBadge method={log.method} />
      </TableCell>

      <TableCell className="py-2.5">
        <span className="rounded bg-zinc-800/80 px-2 py-0.5 text-zinc-200 border border-border/40 font-mono text-[11px]">
          {log.endpoint}
        </span>
      </TableCell>

      <TableCell className="py-2.5">
        <StatusBadge statusCode={log.statusCode} />
      </TableCell>

      <TableCell className="py-2.5 text-right font-bold">
        <span className={isSlow ? "text-rose-400" : isModerate ? "text-amber-400" : "text-emerald-400"}>{log.latency} ms</span>
      </TableCell>

      <TableCell className="py-2.5 text-zinc-300 max-w-[300px] truncate">
        {log.message || <span className="text-zinc-600 italic">No message</span>}
      </TableCell>
    </TableRow>
  );
}

function EmptyStateRow({ isFiltered }: { isFiltered: boolean }) {
  return (
    <TableRow>
      <TableCell colSpan={7} className="h-28 text-center text-muted-foreground font-mono">
        <div className="flex flex-col items-center justify-center gap-1">
          <Layers className="h-5 w-5 text-zinc-600 mb-1" />
          <span>{isFiltered ? "No log entries match your filter criteria." : "No api logs recorded for this view."}</span>
        </div>
      </TableCell>
    </TableRow>
  );
}

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

function PaginationControls({ currentPage, totalPages, totalItems, startIndex, pageSize, onPageChange }: PaginationProps) {
  if (totalItems === 0) return null;

  const currentRangeEnd = Math.min(startIndex + pageSize, totalItems);

  return (
    <div className="flex items-center justify-between border-t border-border/60 bg-muted/10 px-5 py-2.5 font-mono text-xs">
      <div className="text-zinc-400">
        Showing <span className="text-zinc-200 font-semibold">{startIndex + 1}</span>-
        <span className="text-zinc-200 font-semibold">{currentRangeEnd}</span> of{" "}
        <span className="text-zinc-200 font-semibold">{totalItems}</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-zinc-400 text-[11px] mr-1">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-7 w-7 border-border/60 bg-zinc-900/60 hover:bg-zinc-800 disabled:opacity-40"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="h-7 w-7 border-border/60 bg-zinc-900/60 hover:bg-zinc-800 disabled:opacity-40"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
