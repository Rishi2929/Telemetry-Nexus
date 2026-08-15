import { prisma } from "./prisma";

export type DashboardStats = {
  totalRequests: number;
  totalErrors: number;
  errorRate: number;
  averageLatency: number;
};

export type DashboardProject = {
  id: string;
  name: string;
  totalRequests: number;
  totalErrors: number;
  errorRate: number;
  averageLatency: number;
};

export type RecentError = {
  id: string;
  projectId: string;
  projectName: string;
  method: string;
  endpoint: string;
  statusCode: number;
  level: string;
  createdAt: Date;
};

export type RequestTrafficPoint = {
  date: string;
  requests: number;
  errors: number;
};

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
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
      averageLatency: 0,
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
    },
  });

  const totalRequests = logs.length;

  const totalErrors = logs.filter((log) => log.statusCode >= 500).length;

  const errorRate = totalRequests > 0 ? totalErrors / totalRequests : 0;

  const averageLatency = logs.reduce((sum, log) => sum + log.latency, 0) / Math.max(totalRequests, 1);

  return {
    totalRequests,
    totalErrors,
    errorRate,
    averageLatency,
  };
}

export async function getDashboardProjects(userId: string): Promise<DashboardProject[]> {
  const projects = await prisma.project.findMany({
    where: {
      ownerId: userId,
    },
    select: {
      id: true,
      name: true,
      apiLogs: {
        select: {
          statusCode: true,
          latency: true,
        },
      },
    },
  });

  return projects.map((project) => {
    const totalRequests = project.apiLogs.length;

    const totalErrors = project.apiLogs.filter((log) => log.statusCode >= 500).length;

    const errorRate = totalRequests > 0 ? totalErrors / totalRequests : 0;

    const averageLatency = project.apiLogs.reduce((sum, log) => sum + log.latency, 0) / Math.max(totalRequests, 1);

    return {
      id: project.id,
      name: project.name,
      totalRequests,
      totalErrors,
      errorRate,
      averageLatency,
    };
  });
}

export async function getRecentErrors(userId: string): Promise<RecentError[]> {
  const projects = await prisma.project.findMany({
    where: {
      ownerId: userId,
    },
    select: {
      id: true,
      name: true,
      apiLogs: {
        where: {
          statusCode: {
            gte: 400,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
        select: {
          id: true,
          method: true,
          endpoint: true,
          statusCode: true,
          level: true,
          createdAt: true,
        },
      },
    },
  });

  return projects.flatMap((project) =>
    project.apiLogs
      .map((log) => ({
        id: log.id,
        projectId: project.id,
        projectName: project.name,
        method: log.method,
        endpoint: log.endpoint,
        statusCode: log.statusCode,
        level: log.level,
        createdAt: log.createdAt,
      }))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10),
  );
}

export async function getRequestTraffic(userId: string): Promise<RequestTrafficPoint[]> {
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
    return [];
  }

  const logs = await prisma.apiLog.findMany({
    where: {
      projectId: {
        in: projectIds,
      },
    },
    select: {
      statusCode: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const grouped = new Map<string, { requests: number; errors: number }>();

  for (const log of logs) {
    const date = log.createdAt.toISOString().split("T")[0];

    const current = grouped.get(date) ?? {
      requests: 0,
      errors: 0,
    };

    current.requests += 1;

    if (log.statusCode >= 500) {
      current.errors += 1;
    }

    grouped.set(date, current);
  }

  return Array.from(grouped.entries()).map(([date, data]) => ({
    date,
    requests: data.requests,
    errors: data.errors,
  }));
}
