import { notFound } from "next/navigation";

import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "@/lib/auth/session";

import { ProjectEditForm } from "./components/project-edit-form";

type EditProjectPageProps = { params: Promise<{ projectId: string }> };

export default async function EditProjectPage({ params }: EditProjectPageProps) {
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
    <ProjectEditForm
      project={{
        id: project.id,
        name: project.name,
        description: project.description,
      }}
    />
  );
}
