import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { evaluateAlertRulesBatch } from "@/lib/services/incident-engine";

type InsertedLog = {
  id: string;
  projectId: string;
  endpoint: string;
  statusCode: number;
  latency: number;
  createdAt: Date;
};

export async function processTelemetryBatch(logs: Prisma.ApiLogCreateManyInput[]) {
  if (logs.length === 0) return;

  const insertedLogs: InsertedLog[] = [];

  for (const log of logs) {
    if (!log.requestId) {
      const inserted = await prisma.apiLog.create({
        data: log,
        select: {
          id: true,
          projectId: true,
          endpoint: true,
          statusCode: true,
          latency: true,
          createdAt: true,
        },
      });

      insertedLogs.push(inserted);
      continue;
    }

    try {
      const inserted = await prisma.apiLog.create({
        data: log,
        select: {
          id: true,
          projectId: true,
          endpoint: true,
          statusCode: true,
          latency: true,
          createdAt: true,
        },
      });

      insertedLogs.push(inserted);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        console.log(`Skipping duplicate telemetry: ${log.requestId}`);
        continue;
      }

      throw error;
    }
  }

  if (insertedLogs.length === 0) return;

  const logsByProject = new Map<string, InsertedLog[]>();

  for (const log of insertedLogs) {
    const projectLogs = logsByProject.get(log.projectId) ?? [];

    projectLogs.push(log);
    logsByProject.set(log.projectId, projectLogs);
  }

  await Promise.all(
    [...logsByProject.entries()].map(([projectId, projectLogs]) =>
      evaluateAlertRulesBatch({
        projectId,
        logs: projectLogs,
      }),
    ),
  );
}
