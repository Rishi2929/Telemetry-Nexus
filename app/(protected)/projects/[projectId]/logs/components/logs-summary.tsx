import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, Clock, Gauge, Zap } from "lucide-react";

type Props = {
  totalRequests: number;
  totalErrors: number;
  averageLatency: number;
  lastLog?: Date;
};

export function LogsSummary({ totalRequests, totalErrors, averageLatency, lastLog }: Props) {
  // Calculate error rate percentage
  const errorRate = totalRequests > 0 ? ((totalErrors / totalRequests) * 100).toFixed(2) : "0.00";

  // Latency health status color logic
  const isHighLatency = averageLatency > 300;
  const isMedLatency = averageLatency > 150 && !isHighLatency;

  const formattedLastLog = lastLog
    ? new Date(lastLog).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
    : null;

  return (
    <div className="space-y-3 font-sans text-left">
      <StatusHeader totalRequests={totalRequests} errorRate={errorRate} />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Requests */}
        <MetricCard
          title="Total Requests"
          value={totalRequests.toLocaleString()}
          icon={Activity}
          iconColor="text-emerald-400"
          badgeText="LIVE STREAM"
          badgeVariant="emerald"
        />

        {/* Total Errors */}
        <MetricCard
          title="Total Errors"
          value={totalErrors.toLocaleString()}
          subValue={`${errorRate}% rate`}
          icon={AlertTriangle}
          iconColor={totalErrors > 0 ? "text-rose-400" : "text-zinc-500"}
          badgeText={totalErrors > 0 ? "ATTENTION" : "HEALTHY"}
          badgeVariant={totalErrors > 0 ? "rose" : "zinc"}
        />

        {/* Average Latency */}
        <MetricCard
          title="Avg Latency"
          value={`${averageLatency.toFixed(0)} ms`}
          subValue={`${averageLatency.toFixed(2)} ms precise`}
          icon={Gauge}
          iconColor={isHighLatency ? "text-rose-400" : isMedLatency ? "text-amber-400" : "text-emerald-400"}
          badgeText={isHighLatency ? "SLUGGISH" : isMedLatency ? "ELEVATED" : "OPTIMAL"}
          badgeVariant={isHighLatency ? "rose" : isMedLatency ? "amber" : "emerald"}
        />

        {/* Last Log Timestamp */}
        <MetricCard
          title="Last Log Telemetry"
          value={formattedLastLog || "No logs"}
          subValue={lastLog ? new Date(lastLog).toLocaleDateString() : "Awaiting events"}
          icon={Clock}
          iconColor="text-sky-400"
          badgeText={lastLog ? "SYNCED" : "IDLE"}
          badgeVariant={lastLog ? "sky" : "zinc"}
        />
      </div>
    </div>
  );
}

/* Sub-Components */

function StatusHeader({ totalRequests, errorRate }: { totalRequests: number; errorRate: string }) {
  return (
    <div className="flex items-center justify-between px-1 py-1">
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-emerald-400" />
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">Telemetry Overview</span>
      </div>

      <Badge variant="outline" className="font-mono text-[9px] px-1.5 py-0 border-emerald-500/30 text-emerald-400 bg-emerald-500/10 h-4">
        {totalRequests > 0 ? `SYSTEM NOMINAL (${errorRate}% ERR)` : "INACTIVE"}
      </Badge>
    </div>
  );
}

type BadgeVariant = "emerald" | "amber" | "rose" | "sky" | "zinc";

type MetricCardProps = {
  title: string;
  value: string;
  subValue?: string;
  icon: React.ElementType;
  iconColor: string;
  badgeText: string;
  badgeVariant: BadgeVariant;
};

function MetricCard({ title, value, subValue, icon: Icon, iconColor, badgeText, badgeVariant }: MetricCardProps) {
  const badgeStyles: Record<BadgeVariant, string> = {
    emerald: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
    amber: "border-amber-500/30 text-amber-400 bg-amber-500/10",
    rose: "border-rose-500/30 text-rose-400 bg-rose-500/10",
    sky: "border-sky-500/30 text-sky-400 bg-sky-500/10",
    zinc: "border-zinc-700/50 text-zinc-400 bg-zinc-800/40",
  };

  return (
    <Card className="border border-border/80 bg-card/95 backdrop-blur-md shadow-lg transition-all hover:border-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs font-semibold text-zinc-400 uppercase tracking-wider">{title}</span>
          <Badge variant="outline" className={`font-mono text-[9px] px-1.5 py-0 h-4 ${badgeStyles[badgeVariant]}`}>
            {badgeText}
          </Badge>
        </div>

        <div className="mt-2.5 flex items-baseline justify-between gap-2">
          <div className="flex flex-col">
            <p className="font-mono text-2xl font-black tracking-tight text-foreground">{value}</p>
            {subValue && <span className="font-mono text-[11px] text-muted-foreground mt-0.5">{subValue}</span>}
          </div>

          <div className="rounded-md border border-border/40 bg-zinc-900/60 p-2">
            <Icon className={`h-4 w-4 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
