import { getServerSession } from "@/lib/auth/session";
import { getDashboardProjects, getDashboardStats, getRecentErrors, getRequestTraffic } from "@/lib/db/dashboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { ProjectSummary } from "./components/project-summary";
import { RecentErrors } from "./components/recent-errors";
import { RequestTrafficChart } from "./components/request-traffic-chart";

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>

        <p className="text-muted-foreground">Monitor API traffic, latency and incidents.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRequests.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Errors</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{stats.totalErrors.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Error Rate</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{(stats.errorRate * 100).toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Latency</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.averageLatency)} ms</div>
          </CardContent>
        </Card>
      </div>

      <ProjectSummary projects={projects} />
      <RecentErrors errors={recentErrors} />
      <RequestTrafficChart data={traffic} />
    </div>
  );
}
