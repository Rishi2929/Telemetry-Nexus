import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ProjectOverviewPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function ProjectOverviewPage({
  params,
}: ProjectOverviewPageProps) {
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
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{project.name}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">
              Description
            </p>
            <p>{project.description ?? "No description provided"}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Project ID
            </p>
            <p className="font-mono text-sm">{project.id}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Created At
            </p>
            <p>{project.createdAt.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}