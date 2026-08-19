import { prisma } from "@/lib/db/prisma";

type EvaluateIncidentInput = {
  projectId: string;
  endpoint: string;
  statusCode: number;
  latency: number;
  createdAt: Date;
};

export async function evaluateAlertRules({ projectId, endpoint, statusCode, latency, createdAt }: EvaluateIncidentInput) {
  const rules = await prisma.alertRule.findMany({
    where: {
      projectId,
      enabled: true,
    },
  });

  if (rules.length === 0) {
    return [];
  }

  const createdIncidents = [];

  for (const rule of rules) {
    let triggered = false;
    let description = "";

    if (rule.metric === "LATENCY") {
      triggered = latency >= rule.threshold;

      description = `Latency reached ${latency}ms on ${endpoint}. Threshold: ${rule.threshold}ms.`;
    }

    if (rule.metric === "ERROR_RATE") {
      const windowStart = new Date(createdAt.getTime() - 5 * 60 * 1000);

      const recentLogs = await prisma.apiLog.findMany({
        where: {
          projectId,
          createdAt: {
            gte: windowStart,
            lte: createdAt,
          },
        },
        select: {
          statusCode: true,
        },
      });

      if (recentLogs.length > 0) {
        const errors = recentLogs.filter((log) => log.statusCode >= 500).length;

        const errorRate = (errors / recentLogs.length) * 100;

        triggered = errorRate >= rule.threshold;

        description = `Error rate reached ${errorRate.toFixed(1)}% in the last 5 minutes. Threshold: ${rule.threshold}%.`;
      }
    }

    if (!triggered) {
      continue;
    }

    const existingIncident = await prisma.incident.findFirst({
      where: {
        projectId,
        title: rule.name,
        resolved: false,
        ...(rule.metric === "LATENCY" ? { endpoint } : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (existingIncident) {
      await prisma.incident.update({
        where: {
          id: existingIncident.id,
        },
        data: {
          occurrenceCount: {
            increment: 1,
          },
          lastSeenAt: createdAt,
          updatedAt: createdAt,
        },
      });
      continue;
    }

    const incident = await prisma.incident.create({
      data: {
        title: rule.name,
        description,
        severity: rule.severity,
        endpoint: rule.metric === "LATENCY" ? endpoint : null,
        projectId,
        resolved: false,
        occurrenceCount: 1,
        lastSeenAt: createdAt,
        createdAt,
      },
    });

    createdIncidents.push(incident);
  }

  return createdIncidents;
}
