import { prisma } from "./prisma";

export async function getUserIncidents(userId: string) {
  return prisma.incident.findMany({
    where: {
      project: {
        ownerId: userId,
      },
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getIncident(incidentId: string, userId: string) {
  const incident = await prisma.incident.findFirst({
    where: {
      id: incidentId,
      project: {
        ownerId: userId,
      },
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
      occurrences: {
        orderBy: {
          occurredAt: "desc",
        },
        select: {
          id: true,
          endpoint: true,
          statusCode: true,
          latency: true,
          occurredAt: true,
        },
      },
    },
  });

  if (!incident) {
    return null;
  }

  const routeCounts = new Map<string, number>();

  for (const occurrence of incident.occurrences) {
    routeCounts.set(occurrence.endpoint, (routeCounts.get(occurrence.endpoint) ?? 0) + 1);
  }

  const affectedRoutes = Array.from(routeCounts.entries())
    .map(([endpoint, occurrences]) => ({
      endpoint,
      occurrences,
    }))
    .sort((a, b) => b.occurrences - a.occurrences);

  return {
    ...incident,
    affectedRoutes,
  };
}

export async function resolveIncident(incidentId: string, userId: string) {
  return prisma.incident.updateMany({
    where: {
      id: incidentId,
      project: {
        ownerId: userId,
      },
      resolved: false,
    },
    data: {
      resolved: true,
      resolvedAt: new Date(),
    },
  });
}

export async function reopenIncident(incidentId: string, userId: string) {
  return prisma.incident.updateMany({
    where: {
      id: incidentId,
      project: {
        ownerId: userId,
      },
      resolved: true,
    },
    data: {
      resolved: false,
      resolvedAt: null,
    },
  });
}
