import { notFound, redirect } from "next/navigation";

import { getServerSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { getProjectAlertRules } from "@/lib/db/alert-rules";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { AlertRuleForm } from "./components/alert-rule-form";

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Alert Rules</h1>

        <p className="text-muted-foreground">Configure thresholds that generate incidents for {project.name}.</p>
      </div>

      <AlertRuleForm projectId={projectId} />

      <Card>
        <CardHeader>
          <CardTitle>Configured Rules</CardTitle>
        </CardHeader>

        <CardContent>
          {rules.length === 0 ? (
            <p className="text-sm text-muted-foreground">No alert rules configured.</p>
          ) : (
            <div className="space-y-3">
              {rules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">{rule.name}</p>

                    <p className="text-sm text-muted-foreground">
                      {rule.metric} ≥ {rule.threshold}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{rule.severity}</Badge>

                    <Badge variant={rule.enabled ? "default" : "secondary"}>{rule.enabled ? "Enabled" : "Disabled"}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
