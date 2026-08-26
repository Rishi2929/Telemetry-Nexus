import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const benchmarks = [
  {
    metric: "Throughput (1000 Concurrency)",
    sync: "492 req/sec",
    telemetryNexus: "12,163 req/sec",
    benefit: "~24x higher throughput",
  },
  {
    metric: "Mean Request Latency",
    sync: "784 ms",
    telemetryNexus: "119 ms",
    benefit: "84% latency reduction",
  },
  {
    metric: "Database Write Overhead",
    sync: "Direct per-request DB write",
    telemetryNexus: "Batched (500 records / 2s)",
    benefit: "Drastically reduced IOPS",
  },
  {
    metric: "Event Loop Degradation",
    sync: "High blocking contention",
    telemetryNexus: "Non-blocking O(1) execution",
    benefit: "Near-baseline execution",
  },
];

export default function BenchmarkTable() {
  return (
    <section className="py-20 px-4 border-t border-border/40 max-w-5xl mx-auto">
      <div className="text-center space-y-3 mb-12">
        <Badge variant="outline" className="font-mono text-xs text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
          EMPIRICAL PERFORMANCE TEST
        </Badge>
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Synchronous Logging vs. TelemetryNexus</h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Benchmarked under heavy load using Autocannon with 1,000 concurrent HTTP connections.
        </p>
      </div>

      <div className="rounded-xl border border-border/60 bg-card overflow-hidden font-mono text-xs shadow-xl">
        <div className="grid grid-cols-12 bg-muted/60 p-4 border-b border-border/60 font-semibold text-muted-foreground text-[11px] uppercase tracking-wider">
          <div className="col-span-4">Metric</div>
          <div className="col-span-4 text-rose-400/90 flex items-center gap-1">
            <X className="h-3.5 w-3.5" /> Sync DB Logging
          </div>
          <div className="col-span-4 text-emerald-400 flex items-center gap-1">
            <Check className="h-3.5 w-3.5" /> TelemetryNexus
          </div>
        </div>

        <div className="divide-y divide-border/40">
          {benchmarks.map((row, index) => (
            <div key={index} className="grid grid-cols-12 p-4 items-center hover:bg-muted/20 transition-colors">
              <div className="col-span-4 font-sans font-medium text-foreground text-sm">{row.metric}</div>
              <div className="col-span-4 text-muted-foreground">{row.sync}</div>
              <div className="col-span-4 text-foreground font-semibold flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-emerald-400">{row.telemetryNexus}</span>
                <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border/40">
                  {row.benefit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
