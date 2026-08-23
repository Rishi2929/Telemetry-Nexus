import { Prisma } from "@/app/generated/prisma/client";

import { prisma } from "@/lib/db/prisma";

let batchInsertOperations = 0;

export async function processTelemetryBatch(logs: Prisma.ApiLogCreateManyInput[]) {
  if (logs.length === 0) {
    return;
  }
  batchInsertOperations++;

  const result = await prisma.apiLog.createMany({
    data: logs,
  });

  console.log(`Persisted ${logs.length} telemetry logs`);
  console.log(`Batch operation #${batchInsertOperations}: inserted ${result.count} logs`);
}
