import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, Zap, Server } from "lucide-react";

type Props = {
  totalRequests: number;
  totalErrors: number;
  errorRate: number;
  averageLatency: number;
};

export function AnalyticsSummary({ totalRequests, totalErrors, errorRate, averageLatency }: Props) {
  return (
    <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4 font-mono text-left">
      <StatCard title="Total Requests" value={totalRequests.toLocaleString()} icon={Activity} subtitle="Processed telemetry volume" />

      <StatCard
        title="Total Errors"
        value={totalErrors.toLocaleString()}
        icon={AlertTriangle}
        subtitle="Captured exceptions"
        statusColor={totalErrors > 0 ? "text-amber-400" : "text-emerald-400"}
      />

      <StatCard
        title="Error Rate"
        value={`${errorRate.toFixed(2)}%`}
        icon={Server}
        subtitle="Failure percentage"
        statusColor={errorRate >= 5 ? "text-rose-400" : errorRate >= 2 ? "text-amber-400" : "text-emerald-400"}
      />

      <StatCard
        title="Average Latency"
        value={`${averageLatency.toFixed(0)} ms`}
        icon={Zap}
        subtitle="Mean response time"
        statusColor={averageLatency > 300 ? "text-amber-400" : "text-foreground"}
      />
    </div>
  );
}

{
  /* Sub-Component */
}

function StatCard({
  title,
  value,
  icon: Icon,
  subtitle,
  statusColor = "text-foreground",
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  subtitle: string;
  statusColor?: string;
}) {
  return (
    <Card className="relative overflow-hidden border border-border/80 bg-card/95 backdrop-blur-md shadow-lg hover:border-emerald-500/40 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4 space-y-0">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider font-mono">{title}</CardTitle>
        <div className="p-1.5 rounded-md bg-muted/60 border border-border/60 text-emerald-400">
          <Icon className="h-3.5 w-3.5" />
        </div>
      </CardHeader>

      <CardContent className="pb-4 px-4">
        <div className={`text-2xl font-bold font-mono tracking-tight ${statusColor}`}>{value}</div>
        <p className="text-[10px] text-muted-foreground mt-1 font-sans">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
