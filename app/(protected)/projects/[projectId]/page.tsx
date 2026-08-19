import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "@/lib/auth/session";
import { getProjectAnalytics } from "@/lib/db/analytics";
import { ApiKeyManagementCard } from "./components/api-key-management-card";
import { ProjectDetailsCard } from "./components/project-details-card";
import { AnalyticsSummary } from "./analytics/components/analytics-summary";

type ProjectOverviewPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectOverviewPage({ params }: ProjectOverviewPageProps) {
  const { projectId } = await params;

  const session = await getServerSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: session.user.id,
    },
    include: {
      apiKeys: true,
    },
  });

  if (!project) {
    notFound();
  }

  const analytics = await getProjectAnalytics(project.id);

  return (
    <div className="min-w-0 space-y-6">
      <AnalyticsSummary
        totalRequests={analytics.totalRequests}
        totalErrors={analytics.totalErrors}
        errorRate={analytics.errorRate}
        averageLatency={analytics.averageLatency}
      />

      <ProjectDetailsCard project={project} />

      <ApiKeyManagementCard projectId={projectId} apiKey={project.apiKeys[0]} />
    </div>
  );
}
