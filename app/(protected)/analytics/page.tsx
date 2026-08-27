import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";
import { getGlobalAnalytics } from "@/lib/db/global-analytics";

import { MethodsChart } from "./ components/methods-chart";
import { StatusCodesChart } from "./ components/status-codes-chart";
import { EndpointTable } from "./ components/endpoint-table";
import { LatencySummary } from "./ components/latency-summary";
import { AnalyticsPageHeader } from "./ components/analytics-page-header";

export default async function AnalyticsPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const analytics = await getGlobalAnalytics(session.user.id);

  return (
    <div className="relative space-y-8 max-w-7xl mx-auto font-sans text-left">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[200px] bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Header Section */}
      <AnalyticsPageHeader />

      {/* Latency Metrics Summary */}
      <LatencySummary latency={analytics.latency} />

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MethodsChart data={analytics.methods} />
        <StatusCodesChart data={analytics.statusCodes} />
      </div>

      {/* Endpoint Performance Table */}
      <EndpointTable data={analytics.endpoints} />
    </div>
  );
}
