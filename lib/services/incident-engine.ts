import { prisma } from "@/lib/db/prisma";

export type EvaluateIncidentInput = {
  projectId: string;
  endpoint: string;
  statusCode: number;
  latency: number;
  createdAt: Date;
  apiLogId: string;
};

export async function evaluateAlertRules({ projectId, endpoint, statusCode, latency, createdAt, apiLogId }: EvaluateIncidentInput) {
  const rules = await prisma.alertRule.findMany({
    where: {
      projectId,
      enabled: true,
    },
  });
  console.log(
    "ALERT RULES:",
    rules.map((rule) => ({
      id: rule.id,
      name: rule.name,
      metric: rule.metric,
      threshold: rule.threshold,
      severity: rule.severity,
      enabled: rule.enabled,
    })),
  );
  if (rules.length === 0) {
    return [];
  }

  const createdIncidents = [];

  for (const rule of rules) {
    console.log("CHECKING RULE:", {
      name: rule.name,
      metric: rule.metric,
      threshold: rule.threshold,
      endpoint,
      statusCode,
      latency,
    });
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

      /*
       * The project-wide error-rate condition may be triggered,
       * but this particular request only becomes an occurrence
       * if THIS request is itself a 5xx error.
       */
      if (triggered && statusCode < 500) {
        continue;
      }
    }

    console.log("RULE RESULT:", {
      rule: rule.name,
      metric: rule.metric,
      triggered,
    });

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

    let incident;

    if (existingIncident) {
      incident = await prisma.incident.update({
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
    } else {
      incident = await prisma.incident.create({
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

    await prisma.incidentOccurrence.create({
      data: {
        incidentId: incident.id,
        apiLogId,
        endpoint,
        statusCode,
        latency,
        occurredAt: createdAt,
      },
    });
  }

  return createdIncidents;
}

type EvaluateIncidentBatchInput = {
  projectId: string;
  logs: {
    id: string;
    endpoint: string;
    statusCode: number;
    latency: number;
    createdAt: Date;
  }[];
};

export async function evaluateAlertRulesBatch({ projectId, logs }: EvaluateIncidentBatchInput) {
  console.log("Evaluating project:", projectId);
  console.log("Logs in batch:", logs.length);

  for (const log of logs) {
    console.log("Evaluating log:", {
      id: log.id,
      // projectId: log.projectId,
      endpoint: log.endpoint,
      statusCode: log.statusCode,
      latency: log.latency,
      createdAt: log.createdAt,
    });

    await evaluateAlertRules({
      projectId,
      endpoint: log.endpoint,
      statusCode: log.statusCode,
      latency: log.latency,
      createdAt: log.createdAt,
      apiLogId: log.id,
    });
  }
}
