import { getServerSession } from "@/lib/auth/session";
import { getProjectAnalytics } from "@/lib/db/analytics";
import { prisma } from "@/lib/db/prisma";
import { notFound, redirect } from "next/navigation";

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
    <>
      <pre className="max-w-full overflow-x-auto whitespace-pre-wrap break-words">{JSON.stringify(analytics, null, 2)}</pre>
    </>
  );
}
