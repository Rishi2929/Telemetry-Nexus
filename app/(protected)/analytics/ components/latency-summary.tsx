import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gauge, Zap, Activity, AlertCircle } from "lucide-react";

type LatencySummaryProps = {
  latency: {
    average: number;
    p50: number;
    p95: number;
    p99: number;
  };
};

export function LatencySummary({ latency }: LatencySummaryProps) {
  const metrics = [
    {
      label: "Average",
      value: latency.average,
      subtitle: "Mean payload duration",
      icon: Activity,
    },
    {
      label: "P50 (Median)",
      value: latency.p50,
      subtitle: "50th percentile threshold",
      icon: Zap,
    },
    {
      label: "P95",
      value: latency.p95,
      subtitle: "95th percentile threshold",
      icon: Gauge,
    },
    {
      label: "P99",
      value: latency.p99,
      subtitle: "Tail latency (worst 1%)",
      icon: AlertCircle,
    },
  ];

  return (
    <Card className="relative overflow-hidden border border-border/80 bg-card/95 backdrop-blur-md shadow-xl font-sans text-left">
      <ComponentHeader />

      <CardContent className="p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 font-mono">
          {metrics.map((metric) => (
            <MetricBox key={metric.label} {...metric} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

{
  /* Sub-Components */
}

function ComponentHeader() {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-border/60 bg-muted/20">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <Gauge className="h-3.5 w-3.5" />
          </div>
          <h2 className="text-base font-extrabold tracking-tight text-foreground font-sans">Latency Analysis</h2>
          <Badge
            variant="outline"
            className="font-mono text-[9px] px-1.5 py-0 border-emerald-500/30 text-emerald-400 bg-emerald-500/10 h-4"
          >
            SLA METRICS
          </Badge>
        </div>
        <p className="text-xs font-mono text-muted-foreground">Percentile response distribution across recorded API calls.</p>
      </div>
    </div>
  );
}

function MetricBox({ label, value, subtitle, icon: Icon }: { label: string; value: number; subtitle: string; icon: React.ElementType }) {
  const roundedValue = Math.round(value);

  // SLA Threshold Coloring Strategy
  const getLatencyColor = (ms: number) => {
    if (ms >= 500) return "text-rose-400";
    if (ms >= 250) return "text-amber-400";
    return "text-emerald-400";
  };

  return (
    <div className="space-y-2 rounded-md border border-border/40 bg-muted/10 p-3.5 transition-colors hover:border-emerald-500/30">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-[10px] font-mono uppercase tracking-wider">{label}</span>
        <Icon className="h-3.5 w-3.5 text-emerald-400/80" />
      </div>

      <div className="space-y-0.5">
        <div className={`text-2xl font-bold font-mono tracking-tight ${getLatencyColor(roundedValue)}`}>
          {roundedValue} <span className="text-xs font-normal text-muted-foreground">ms</span>
        </div>
        <p className="text-[10px] text-muted-foreground font-sans">{subtitle}</p>
      </div>
    </div>
  );
}
