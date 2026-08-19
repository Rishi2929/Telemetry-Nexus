import { prisma } from "./prisma";

type DetectIncidentInput = {
  projectId: string;
  endpoint: string;
  statusCode: number;
  latency: number;
  createdAt: Date;
};

function getSeverity(statusCode: number, latency: number) {
  if (statusCode >= 500) {
    return "CRITICAL" as const;
  }

  if (latency >= 2000) {
    return "HIGH" as const;
  }

  return "MEDIUM" as const;
}

export async function detectIncident({ projectId, endpoint, statusCode, latency, createdAt }: DetectIncidentInput) {
  const isServerError = statusCode >= 500;
  const isHighLatency = latency >= 1000;

  if (!isServerError && !isHighLatency) {
    return null;
  }

  const title = isServerError ? "Server Error" : "High Latency";

  const severity = getSeverity(statusCode, latency);

  const existingIncident = await prisma.incident.findFirst({
    where: {
      projectId,
      endpoint,
      title,
      resolved: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (existingIncident) {
    return prisma.incident.update({
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
  }
  return prisma.incident.create({
    data: {
      projectId,
      endpoint,
      title,
      description: isServerError ? `${statusCode} response detected on ${endpoint}` : `Latency of ${latency}ms detected on ${endpoint}`,
      severity,
      resolved: false,
      createdAt,
    },
  });
}

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
  return prisma.incident.findFirst({
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
    },
  });
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
