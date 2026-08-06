import { LogSchema } from "../validation/log-schema";
import { prisma } from "./prisma";

export async function createApiLog(projectId: string, data: LogSchema) {
  return prisma.apiLog.create({
    data: {
      projectId,
      ...data,
    },
  });
}
