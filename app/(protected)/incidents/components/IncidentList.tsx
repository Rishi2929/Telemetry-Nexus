"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AlertTriangle, Clock, Layers, ShieldAlert, Terminal, ChevronLeft, ChevronRight } from "lucide-react";

export type Incident = {
  id: string;
  title: string;
  description: string | null;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  endpoint: string | null;
  resolved: boolean;
  occurrenceCount: number;
  lastSeenAt: Date;
  createdAt: Date;
  updatedAt: Date;
  project: {
    id: string;
    name: string;
  };
};

type IncidentListProps = {
  incidents: Incident[];
  pageSize?: number;
};

export function IncidentList({ incidents, pageSize = 5 }: IncidentListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever the underlying incidents array updates/filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [incidents]);

  const unresolvedCount = incidents.filter((i) => !i.resolved).length;
  const totalPages = Math.ceil(incidents.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentIncidents = incidents.slice(startIndex, startIndex + pageSize);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <Card className="relative overflow-hidden border border-border/80 bg-card/95 backdrop-blur-md shadow-xl font-sans text-left flex flex-col justify-between">
      <div>
        <ComponentHeader total={incidents.length} openCount={unresolvedCount} />

        <CardContent className="p-5">
          {incidents.length === 0 ? (
            <EmptyIncidentState />
          ) : (
            <div className="space-y-3">
              {currentIncidents.map((incident) => (
                <IncidentItemCard key={incident.id} incident={incident} />
              ))}
            </div>
          )}
        </CardContent>
      </div>

      {/* Pagination Footer */}
      {incidents.length > 0 && (
        <CardFooter className="flex items-center justify-between border-t border-border/60 bg-muted/20 px-5 py-3 font-mono text-xs">
          <p className="text-[11px] text-muted-foreground">
            Showing <span className="text-foreground font-semibold">{startIndex + 1}</span>–
            <span className="text-foreground font-semibold">{Math.min(startIndex + pageSize, incidents.length)}</span> of{" "}
            <span className="text-foreground font-semibold">{incidents.length}</span> incidents
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

function ComponentHeader({ total, openCount }: { total: number; openCount: number }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-border/60 bg-muted/20">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-amber-500/30 bg-amber-500/10 text-amber-400">
            <AlertTriangle className="h-3.5 w-3.5" />
          </div>
          <h2 className="text-base font-extrabold tracking-tight text-foreground font-sans">Incident History</h2>
          <Badge variant="outline" className="font-mono text-[9px] px-1.5 py-0 border-amber-500/30 text-amber-400 bg-amber-500/10 h-4">
            {openCount} OPEN / {total} TOTAL
          </Badge>
        </div>
        <p className="text-xs font-mono text-muted-foreground">
          Historical record of system alerts, runtime errors, and endpoint anomalies.
        </p>
      </div>
    </div>
  );
}

function IncidentItemCard({ incident }: { incident: Incident }) {
  return (
    <Link
      href={`/incidents/${incident.id}`}
      className="group block rounded-lg border border-border/70 bg-black/40 p-4 transition-all duration-150 hover:border-amber-500/40 hover:bg-muted/30 hover:shadow-md"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-sm text-foreground transition-colors group-hover:text-amber-400">{incident.title}</h3>

            <SeverityBadge severity={incident.severity} />

            <Badge
              variant="outline"
              className={`font-mono text-[10px] px-1.5 py-0.5 ${
                incident.resolved
                  ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                  : "border-rose-500/30 text-rose-400 bg-rose-500/10 animate-pulse"
              }`}
            >
              {incident.resolved ? "RESOLVED" : "OPEN"}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1 text-zinc-300">
              <Layers className="h-3 w-3 text-muted-foreground" />
              {incident.project.name}
            </span>
            {incident.endpoint && (
              <>
                <span>•</span>
                <span className="truncate rounded bg-zinc-800/80 px-1.5 py-0.5 text-[11px] text-zinc-400">{incident.endpoint}</span>
              </>
            )}
          </div>

          <div className="pt-1 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="font-mono text-[10px] bg-zinc-800/60 text-zinc-400 border border-border/50">
              {incident.occurrenceCount} {incident.occurrenceCount === 1 ? "occurrence" : "occurrences"}
            </Badge>
          </div>
        </div>

        <div className="shrink-0 flex flex-col gap-1.5 sm:items-end border-t sm:border-t-0 pt-2 sm:pt-0 border-border/40 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Last seen:</span>
            <span className="text-foreground">{new Date(incident.lastSeenAt).toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-1.5 text-muted-foreground">
            <ShieldAlert className="h-3 w-3" />
            <span>Updated:</span>
            <span className="text-zinc-400">{new Date(incident.updatedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function SeverityBadge({ severity }: { severity: Incident["severity"] }) {
  const styles = {
    LOW: "border-sky-500/30 text-sky-400 bg-sky-500/10",
    MEDIUM: "border-amber-500/30 text-amber-400 bg-amber-500/10",
    HIGH: "border-orange-500/30 text-orange-400 bg-orange-500/10",
    CRITICAL: "border-rose-500/30 text-rose-400 bg-rose-500/10 font-bold",
  };

  return (
    <Badge variant="outline" className={`font-mono text-[10px] px-1.5 py-0.5 ${styles[severity]}`}>
      {severity}
    </Badge>
  );
}

function EmptyIncidentState() {
  return (
    <div className="flex h-[200px] flex-col items-center justify-center text-center font-mono space-y-2">
      <Terminal className="h-6 w-6 text-muted-foreground/60" />
      <p className="text-xs text-muted-foreground">No incidents detected in telemetry logs.</p>
    </div>
  );
}
