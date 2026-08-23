import "dotenv/config";
import { redis } from "@/lib/redis/client";
import { TELEMETRY_STREAM } from "@/lib/redis/telemetry-stream";
import { processTelemetryBatch } from "@/lib/services/telemetry-batch-processor";
import { Prisma } from "@/app/generated/prisma/client";

let lastId = "0-0";
const BATCH_SIZE = 500;
const BATCH_TIMEOUT = 2000;

let buffer: Prisma.ApiLogCreateManyInput[] = [];
let flushTimer: NodeJS.Timeout | null = null;

async function flushBuffer() {
  if (buffer.length === 0) {
    return;
  }

  const batch = buffer;

  buffer = [];

  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }

  await processTelemetryBatch(batch);

  console.log(`Flushed batch of ${batch.length} logs`);
}

function startFlushTimer() {
  if (flushTimer) {
    return;
  }

  flushTimer = setTimeout(() => {
    flushBuffer().catch((error) => {
      console.error("Batch flush error:", error);
    });
  }, BATCH_TIMEOUT);
}

//This is the consumer
async function processTelemetry() {
  const result = await redis.xread("COUNT", BATCH_SIZE, "BLOCK", 5000, "STREAMS", TELEMETRY_STREAM, lastId);

  // console.log("XREAD RESULT:", result);

  if (!result) {
    return;
  }

  for (const [, messages] of result) {
    for (const [id, fields] of messages) {
      const dataIndex = fields.indexOf("data");

      if (dataIndex === -1) {
        console.error(`Missing data field in Redis message ${id}`);
        continue;
      }

      const data = JSON.parse(fields[dataIndex + 1]);

      buffer.push({
        projectId: data.projectId,
        requestId: data.requestId,
        level: data.level,
        message: data.message,
        method: data.method,
        endpoint: data.endpoint,
        environment: data.environment,
        statusCode: data.statusCode,
        latency: data.latency,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        metadata: data.metadata,
        createdAt: new Date(data.createdAt),
      });

      lastId = id;

      if (buffer.length === 1) {
        startFlushTimer();
      }
      if (buffer.length >= BATCH_SIZE) {
        await flushBuffer();
      }
    }
  }

  // await processTelemetryBatch(logs);

  console.log(`Processed ${buffer.length} telemetry logs`);
}

async function main() {
  console.log("Telemetry worker started");

  while (true) {
    try {
      await processTelemetry();
    } catch (error) {
      console.error("Telemetry worker error:", error);
    }
  }
}

main();
