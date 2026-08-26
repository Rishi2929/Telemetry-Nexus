import { getServerSession } from "@/lib/auth/session";
import { getDashboardProjects, getDashboardStats, getRecentErrors, getRequestTraffic } from "@/lib/db/dashboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import { ProjectSummary } from "./components/project-summary";
import { RecentErrors } from "./components/recent-errors";
import { RequestTrafficChart } from "./components/request-traffic-chart";
import { Terminal, Activity, AlertTriangle, Zap, Server } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const [stats, projects, recentErrors, traffic] = await Promise.all([
    getDashboardStats(session.user.id),
    getDashboardProjects(session.user.id),
    getRecentErrors(session.user.id),
    getRequestTraffic(session.user.id),
  ]);

  return (
    <div className="relative space-y-6 max-w-7xl mx-auto font-sans">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[200px] bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Dashboard Overview</h1>
            <Badge
              variant="outline"
              className="font-mono text-[9px] px-2 py-0.5 border-emerald-500/30 text-emerald-400 bg-emerald-500/10 flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE TELEMETRY
            </Badge>
          </div>
          <p className="text-xs font-mono text-muted-foreground">Real-time API traffic performance, error rates, and system latencies.</p>
        </div>

        {/* User / Session Context Tag */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/60 bg-card/60 font-mono text-xs text-muted-foreground w-fit">
          <Terminal className="h-3.5 w-3.5 text-emerald-400" />
          <span>node@cluster-us-east</span>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 font-mono">
        <StatCard title="Total Requests" value={stats.totalRequests.toLocaleString()} icon={Activity} subtitle="Processed volume" />
        <StatCard
          title="Total Errors"
          value={stats.totalErrors.toLocaleString()}
          icon={AlertTriangle}
          subtitle="Logged exceptions"
          statusColor={stats.totalErrors > 0 ? "text-amber-400" : "text-emerald-400"}
        />
        <StatCard
          title="Error Rate"
          value={`${(stats.errorRate * 100).toFixed(1)}%`}
          icon={Server}
          subtitle="Failure percentage"
          statusColor={stats.errorRate > 0.05 ? "text-rose-400" : "text-emerald-400"}
        />
        <StatCard title="Average Latency" value={`${Math.round(stats.averageLatency)} ms`} icon={Zap} subtitle="Mean response time" />
      </div>

      {/* Structured Sections */}
      <div className="space-y-6 pt-2">
        <ProjectSummary projects={projects} />
        <RequestTrafficChart data={traffic} />
        <RecentErrors errors={recentErrors} />
      </div>
    </div>
  );
}

{
  /* Stat Card Sub-Component */
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
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</CardTitle>
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
