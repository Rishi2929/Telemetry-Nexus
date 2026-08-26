import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Terminal, FolderKanban, Activity, ArrowUpRight } from "lucide-react";
import type { DashboardProject } from "@/lib/db/dashboard";

type ProjectSummaryProps = {
  projects: DashboardProject[];
};

export function ProjectSummary({ projects }: ProjectSummaryProps) {
  return (
    <Card className="relative overflow-hidden border border-border/80 bg-card/95 backdrop-blur-md shadow-xl font-sans text-left">
      <ComponentHeader count={projects.length} />

      <CardContent className="p-0">
        {projects.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <Table className="font-mono text-xs">
              <TableHeader className="bg-muted/40 border-b border-border/60">
                <TableRow className="hover:bg-transparent border-border/60">
                  <TableHead className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">Project</TableHead>
                  <TableHead className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">Requests</TableHead>
                  <TableHead className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">Errors</TableHead>
                  <TableHead className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">Error Rate</TableHead>
                  <TableHead className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">Avg. Latency</TableHead>
                  <TableHead className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider text-right">Health</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {projects.map((project) => (
                  <ProjectRow key={project.id} project={project} />
                ))}
              </TableBody>
            </Table>
          </div>
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
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <FolderKanban className="h-4 w-4 text-emerald-400" />
          <h2 className="text-base font-extrabold tracking-tight text-foreground font-sans">Project Summary</h2>
        </div>
        <p className="text-xs font-mono text-muted-foreground">Telemetry metrics and status monitors across active projects.</p>
      </div>

      <Badge
        variant="outline"
        className="font-mono text-[10px] px-2.5 py-0.5 border-border/80 bg-black/30 text-muted-foreground flex items-center gap-1.5"
      >
        <Activity className="h-3 w-3 text-emerald-400" />
        <span>{count} ACTIVE</span>
      </Badge>
    </div>
  );
}

function ProjectRow({ project }: { project: DashboardProject }) {
  const health = project.errorRate >= 0.05 ? "Critical" : project.errorRate >= 0.02 ? "Warning" : "Healthy";

  return (
    <TableRow className="hover:bg-muted/40 transition-colors border-border/40">
      <TableCell className="font-sans font-medium">
        <Link href={`/projects/${project.id}`} className="inline-flex items-center gap-1 hover:text-emerald-400 transition-colors group">
          <span>{project.name}</span>
          <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
        </Link>
      </TableCell>

      <TableCell className="text-foreground">{project.totalRequests.toLocaleString()}</TableCell>

      <TableCell className={project.totalErrors > 0 ? "text-amber-400 font-semibold" : "text-muted-foreground"}>
        {project.totalErrors.toLocaleString()}
      </TableCell>

      <TableCell className={project.errorRate >= 0.05 ? "text-rose-400 font-semibold" : "text-foreground"}>
        {(project.errorRate * 100).toFixed(1)}%
      </TableCell>

      <TableCell className="text-foreground">
        {Math.round(project.averageLatency)} <span className="text-[10px] text-muted-foreground">ms</span>
      </TableCell>

      <TableCell className="text-right">
        <HealthBadge health={health} />
      </TableCell>
    </TableRow>
  );
}

function HealthBadge({ health }: { health: "Critical" | "Warning" | "Healthy" }) {
  if (health === "Critical") {
    return (
      <Badge variant="outline" className="font-mono text-[10px] border-rose-500/30 text-rose-400 bg-rose-500/10">
        CRITICAL
      </Badge>
    );
  }

  if (health === "Warning") {
    return (
      <Badge variant="outline" className="font-mono text-[10px] border-amber-500/30 text-amber-400 bg-amber-500/10">
        WARNING
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="font-mono text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
      HEALTHY
    </Badge>
  );
}

function EmptyState() {
  return (
    <div className="p-8 text-center font-mono space-y-2">
      <Terminal className="h-6 w-6 text-muted-foreground mx-auto opacity-50" />
      <p className="text-xs text-muted-foreground">No monitored projects detected.</p>
    </div>
  );
}
