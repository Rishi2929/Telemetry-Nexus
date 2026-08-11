import { LogLevel, Method } from "@/app/generated/prisma/enums";
import { prisma } from "./prisma";

type ApiLogRow = {
  statusCode: number;
  latency: number;
  method: Method;
  level: LogLevel;
  endpoint: string;
  createdAt: Date;
};

function countBy<T>(items: T[], keyFn: (item: T) => string | number) {
  const counts = items.reduce<Record<string, number>>((acc, item) => {
    const key = String(keyFn(item));

    acc[key] = (acc[key] ?? 0) + 1;

    return acc;
  }, {});

  return Object.entries(counts).map(([key, count]) => ({
    key,
    count,
  }));
}

function getErrorRate(logs: ApiLogRow[]) {
  const total = logs.length;

  const errors = logs.filter((log) => log.statusCode >= 500).length;

  return {
    totalRequests: total,
    totalErrors: errors,
    errorRate: total > 0 ? (errors / total) * 100 : 0,
  };
}

function getAverageLatency(logs: ApiLogRow[]) {
  if (logs.length === 0) {
    return 0;
  }

  return logs.reduce((sum, log) => sum + log.latency, 0) / logs.length;
}

function getEndpointStats(logs: ApiLogRow[]) {
  const endpointMap = logs.reduce<
    Record<
      string,
      {
        requests: number;
        errors: number;
        totalLatency: number;
      }
    >
  >((acc, log) => {
    acc[log.endpoint] ??= {
      requests: 0,
      errors: 0,
      totalLatency: 0,
    };

    acc[log.endpoint].requests += 1;
    acc[log.endpoint].totalLatency += log.latency;

    if (log.statusCode >= 500) {
      acc[log.endpoint].errors += 1;
    }

    return acc;
  }, {});

  return Object.entries(endpointMap)
    .map(([endpoint, data]) => ({
      endpoint,
      requests: data.requests,
      errors: data.errors,
      averageLatency: data.totalLatency / data.requests,
    }))
    .sort((a, b) => b.requests - a.requests);
}

async function fetchRecentLogs(projectId: string): Promise<ApiLogRow[]> {
  const thirtyDaysAgo = new Date();

  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return prisma.apiLog.findMany({
    where: {
      projectId,
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
    select: {
      statusCode: true,
      latency: true,
      method: true,
      level: true,
      endpoint: true,
      createdAt: true,
    },
  });
}

function getRequestByDay(logs: ApiLogRow[]) {
  const counts = logs.reduce<Record<string, number>>((acc, log) => {
    const date = log.createdAt.toISOString().split("T")[0];

    acc[date] = (acc[date] ?? 0) + 1;

    return acc;
  }, {});

  return Object.entries(counts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function getProjectAnalytics(projectId: string) {
  const logs = await fetchRecentLogs(projectId);

  return {
    ...getErrorRate(logs),

    averageLatency: getAverageLatency(logs),

    statusCodes: countBy(logs, (log) => log.statusCode).map(({ key, count }) => ({
      statusCode: Number(key),
      count,
    })),

    methods: countBy(logs, (log) => log.method).map(({ key, count }) => ({
      method: key as Method,
      count,
    })),

    levels: countBy(logs, (log) => log.level).map(({ key, count }) => ({
      level: key as LogLevel,
      count,
    })),

    endpoints: getEndpointStats(logs),
    requestsByDay: getRequestByDay(logs),
  };
}
