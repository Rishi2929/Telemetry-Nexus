import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DeleteProjectDialog } from "./delete-project-dialog";

type ProjectOverviewPageProps = {
  params: Promise<{
    projectId: string;
  }>;
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
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>{project.name}</CardTitle>
          </div>

          <div className="flex gap-2">
            <Button variant="outline">
              <Link href={`/projects/${project.id}/edit`}>Edit</Link>
            </Button>

            <DeleteProjectDialog projectId={project.id} projectName={project.name} />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">Description</p>
            <p>{project.description ?? "No description provided"}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Project ID</p>
            <p className="font-mono text-sm">{project.id}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Created At</p>
            <p>{project.createdAt.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
