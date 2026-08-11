import { getServerSession } from "@/lib/auth/session";
import { getProjectAnalytics } from "@/lib/db/analytics";
import { prisma } from "@/lib/db/prisma";
import { notFound, redirect } from "next/navigation";
import { AnalyticsSummary } from "./components/analytics-summary";
import { StatusChart } from "./components/status-chart";
import { EndpointTable } from "./components/endpoint-table";
import { MethodChart } from "./components/method-chart";

type Props = {
  params: Promise<{ projectId: string }>;
};

export default async function AnalyticsPage({ params }: Props) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const { projectId } = await params;

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: session.user.id,
    },
  });

  if (!project) {
    notFound();
  }

  const analytics = await getProjectAnalytics(project?.id);

  return (
    <div className="min-w-0 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>

        <p className="text-muted-foreground">Monitor your project's API performance.</p>
      </div>

      <AnalyticsSummary
        totalRequests={analytics.totalRequests}
        totalErrors={analytics.totalErrors}
        errorRate={analytics.errorRate}
        averageLatency={analytics.averageLatency}
      />
      <EndpointTable endpoints={analytics.endpoints} />

      <MethodChart data={analytics.methods} />

      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        <StatusChart data={analytics.statusCodes} />

        {/* Method chart later */}
      </div>
    </div>
  );
}
