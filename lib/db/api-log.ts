import { LogLevel, Method } from "@/app/generated/prisma/enums";
import { LogSchema } from "../validation/log-schema";
import { prisma } from "./prisma";
import { evaluateAlertRules } from "@/lib/services/incident-engine";

export async function createApiLog(projectId: string, data: LogSchema) {
  const log = await prisma.apiLog.create({
    data: {
      projectId,
      ...data,
    },
  });

  await evaluateAlertRules({
    projectId: log.projectId,
    endpoint: log.endpoint,
    statusCode: log.statusCode,
    latency: log.latency,
    createdAt: log.createdAt,
  });

  return log;
}

type GetProjectLogsOptions = {
  level?: LogLevel;
  method?: Method;
  statusCode?: number;
};

export async function getProjectLogs(projectId: string, options?: GetProjectLogsOptions) {
  return prisma.apiLog.findMany({
    where: {
      projectId,

      ...(options?.level && {
        level: options.level,
      }),

      ...(options?.method && {
        method: options.method,
      }),

      ...(options?.statusCode && {
        statusCode: options.statusCode,
      }),
    },

    orderBy: {
      createdAt: "desc",
    },

    take: 50,
  });
}
