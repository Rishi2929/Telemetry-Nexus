import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "@/lib/auth/session";
import { ApiKeyManagementCard } from "./components/api-key-management-card";
import { ProjectDetailsCard } from "./components/project-details-card";

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

  return (
    <div className="space-y-6">
      <ProjectDetailsCard project={project} />
      <ApiKeyManagementCard projectId={projectId} apiKey={project.apiKeys[0]} />{" "}
    </div>
  );
}
