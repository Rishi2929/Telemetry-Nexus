import { prisma } from "@/lib/db/prisma";

type ApiLogRow = {
  statusCode: number;
  latency: number;
  method: string;
  level: string;
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

function getPercentile(values: number[], percentile: number) {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);

  const index = Math.ceil((percentile / 100) * sorted.length) - 1;

  return sorted[Math.max(0, index)];
}

export async function getGlobalAnalytics(userId: string) {
  const projects = await prisma.project.findMany({
    where: {
      ownerId: userId,
    },
    select: {
      id: true,
    },
  });

  const projectIds = projects.map((project) => project.id);

  if (projectIds.length === 0) {
    return {
      totalRequests: 0,
      totalErrors: 0,
      errorRate: 0,
      latency: {
        average: 0,
        p50: 0,
        p95: 0,
        p99: 0,
      },
      statusCodes: [],
      methods: [],
      levels: [],
      endpoints: [],
    };
  }

  const logs = await prisma.apiLog.findMany({
    where: {
      projectId: {
        in: projectIds,
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
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalRequests = logs.length;

  const totalErrors = logs.filter((log) => log.statusCode >= 500).length;

  const errorRate = totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0;

  const latencies = logs.map((log) => log.latency);

  const latency = {
    average: latencies.length > 0 ? latencies.reduce((sum, value) => sum + value, 0) / latencies.length : 0,

    p50: getPercentile(latencies, 50),
    p95: getPercentile(latencies, 95),
    p99: getPercentile(latencies, 99),
  };

  return {
    totalRequests,
    totalErrors,
    errorRate,
    latency,

    statusCodes: countBy(logs, (log) => log.statusCode).map(({ key, count }) => ({
      statusCode: Number(key),
      count,
    })),

    methods: countBy(logs, (log) => log.method).map(({ key, count }) => ({
      method: key,
      count,
    })),

    levels: countBy(logs, (log) => log.level).map(({ key, count }) => ({
      level: key,
      count,
    })),

    endpoints: getEndpointStats(logs),
  };
}
