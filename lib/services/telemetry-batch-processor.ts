import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { evaluateAlertRulesBatch } from "@/lib/services/incident-engine";

export async function processTelemetryBatch(logs: Prisma.ApiLogCreateManyInput[]) {
  if (logs.length === 0) return;

  const insertedLogs = await prisma.apiLog.createManyAndReturn({
    data: logs,
    select: {
      id: true,
      projectId: true,
      endpoint: true,
      statusCode: true,
      latency: true,
      createdAt: true,
    },
  });

  const logsByProject = new Map<string, typeof insertedLogs>();
  for (const log of insertedLogs) {
    const projectLogs = logsByProject.get(log.projectId) ?? [];
    projectLogs.push(log);
    logsByProject.set(log.projectId, projectLogs);
  }

  await Promise.all(
    [...logsByProject.entries()].map(([projectId, projectLogs]) => evaluateAlertRulesBatch({ projectId, logs: projectLogs })),
  );
}
