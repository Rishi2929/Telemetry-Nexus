import { randomUUID } from "crypto";

import { Prisma } from "@/app/generated/prisma/client";

import { prisma } from "@/lib/db/prisma";

import { evaluateAlertRulesBatch } from "@/lib/services/incident-engine";

export async function processTelemetryBatch(logs: Prisma.ApiLogCreateManyInput[]) {
  if (logs.length === 0) {
    return;
  }

  const batchId = randomUUID();

  const batchLogs = logs.map((log) => ({
    ...log,
    batchId,
  }));

  await prisma.apiLog.createMany({
    data: batchLogs,
  });

  const insertedLogs = await prisma.apiLog.findMany({
    where: {
      batchId,
    },
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
  console.log("PROJECT GROUPS:", {
    projects: logsByProject.size,
    groups: [...logsByProject.entries()].map(([projectId, logs]) => ({
      projectId,
      count: logs.length,
    })),
  });

  for (const [projectId, projectLogs] of logsByProject) {
    console.log("CALLING INCIDENT ENGINE:", {
      projectId,
      logCount: projectLogs.length,
    });

    await evaluateAlertRulesBatch({
      projectId,
      logs: projectLogs,
    });

    console.log("INCIDENT ENGINE FINISHED:", projectId);
  }

  console.log(`Persisted ${insertedLogs.length} telemetry logs across ${logsByProject.size} projects`);
}
