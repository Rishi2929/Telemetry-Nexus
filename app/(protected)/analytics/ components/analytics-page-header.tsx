import { BarChart3, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AnalyticsPageHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <BarChart3 className="h-4 w-4" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Global Analytics</h1>
          <Badge
            variant="outline"
            className="font-mono text-[9px] px-2 py-0.5 border-emerald-500/30 text-emerald-400 bg-emerald-500/10 flex items-center gap-1"
          >
            <Activity className="h-2.5 w-2.5 animate-pulse" />
            LIVE METRICS
          </Badge>
        </div>
        <p className="text-xs font-mono text-muted-foreground">
          Monitor response latencies, HTTP status codes, and endpoint traffic across all projects.
        </p>
      </div>
    </div>
  );
}
