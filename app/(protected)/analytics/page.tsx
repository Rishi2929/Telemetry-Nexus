import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/auth/session";
import { getGlobalAnalytics } from "@/lib/db/global-analytics";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MethodsChart } from "./ components/methods-chart";
import { StatusCodesChart } from "./ components/status-codes-chart";
import { EndpointTable } from "./ components/endpoint-table";
import { LatencySummary } from "./ components/latency-summary";

export default async function AnalyticsPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const analytics = await getGlobalAnalytics(session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Analytics</h1>

        <p className="text-muted-foreground">Monitor API performance across all your projects.</p>
      </div>
      <LatencySummary latency={analytics.latency} />
      {/* <pre className="overflow-x-auto rounded-lg border p-4 text-sm">{JSON.stringify(analytics, null, 2)}</pre> */}
      <MethodsChart data={analytics.methods} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MethodsChart data={analytics.methods} />
        <StatusCodesChart data={analytics.statusCodes} />
      </div>

      <EndpointTable data={analytics.endpoints} />
    </div>
  );
}
