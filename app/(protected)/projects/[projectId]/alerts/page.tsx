import { notFound, redirect } from "next/navigation";

import { getServerSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { getProjectAlertRules } from "@/lib/db/alert-rules";

import { AlertRuleForm } from "./components/alert-rule-form";

import { Bell, ShieldCheck } from "lucide-react";
import { AlertRulesList } from "./components/alert-rule-list";

type AlertsPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function AlertsPage({ params }: AlertsPageProps) {
  const { projectId } = await params;

  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: session.user.id,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!project) {
    notFound();
  }

  const rules = await getProjectAlertRules(projectId);

  return (
    <div className="space-y-6 font-sans">
      {/* Main Grid Layout */}
      <div className=" space-y-10 ">
        <AlertRuleForm projectId={projectId} />
        <AlertRulesList projectId={projectId} rules={rules} />
      </div>
    </div>
  );
}
