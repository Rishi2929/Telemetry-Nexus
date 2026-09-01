import "dotenv/config";

import { randomUUID } from "crypto";

import { Prisma } from "@/app/generated/prisma/client";

import { redis } from "@/lib/redis/client";

import { TELEMETRY_STREAM } from "@/lib/redis/telemetry-stream";

import { ensureTelemetryConsumerGroup, TELEMETRY_CONSUMER_GROUP } from "@/lib/redis/consumer-group";

import { processTelemetryBatch } from "@/lib/services/telemetry-batch-processor";

const CONSUMER_NAME = `worker-${randomUUID()}`;

const BATCH_SIZE = 500;
const BATCH_TIMEOUT = 2000;

type BufferedTelemetry = {
  id: string;
  log: Prisma.ApiLogCreateManyInput;
};

let buffer: BufferedTelemetry[] = [];

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

  try {
    await processTelemetryBatch(batch.map((item) => item.log));

    // console.log("TEST: stopping before XACK");

    // process.exit(1);

    await redis.xack(TELEMETRY_STREAM, TELEMETRY_CONSUMER_GROUP, ...batch.map((item) => item.id));

    console.log(`Flushed and acknowledged batch of ${batch.length} logs`);
  } catch (error) {
    // Put the messages back into the buffer.
    buffer.unshift(...batch);

    console.error("Batch processing failed:", error);

    throw error;
  }
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

// Consumer
async function processTelemetry() {
  const result = await redis.xreadgroup(
    "GROUP",
    TELEMETRY_CONSUMER_GROUP,
    CONSUMER_NAME,
    "COUNT",
    BATCH_SIZE,
    "BLOCK",
    5000,
    "STREAMS",
    TELEMETRY_STREAM,
    ">",
  );

  if (!result) {
    return;
  }

  for (const [, messages] of result) {
    for (const [id, fields] of messages) {
      if (!fields) {
        console.error(`Missing fields in Redis message ${id}`);
        continue;
      }
      const dataIndex = fields.indexOf("data");

      if (dataIndex === -1) {
        console.error(`Missing data field in Redis message ${id}`);

        continue;
      }

      const data = JSON.parse(fields[dataIndex + 1]);

      buffer.push({
        id,

        log: {
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
        },
      });

      if (buffer.length === 1) {
        startFlushTimer();
      }

      if (buffer.length >= BATCH_SIZE) {
        await flushBuffer();
      }
    }
  }
}

async function main() {
  await ensureTelemetryConsumerGroup();

  console.log("Telemetry worker started");
  console.log(`Consumer group: ${TELEMETRY_CONSUMER_GROUP}`);
  console.log(`Consumer: ${CONSUMER_NAME}`);

  await recoverPendingMessages();

  while (true) {
    try {
      await processTelemetry();
    } catch (error) {
      console.error("Telemetry worker error:", error);
    }
  }
}

main().catch((error) => {
  console.error("Telemetry worker failed to start:", error);
  process.exit(1);
});

async function recoverPendingMessages() {
  // const PENDING_MESSAGE_IDLE_TIME_DEV = 5_000;

  const PENDING_MESSAGE_IDLE_TIME = 30_000;

  const result = await redis.xautoclaim(
    TELEMETRY_STREAM,
    TELEMETRY_CONSUMER_GROUP,
    CONSUMER_NAME,
    PENDING_MESSAGE_IDLE_TIME,
    "0-0",
    "COUNT",
    BATCH_SIZE,
  );

  const messages = result[1] as [string, string[]][] | undefined;

  if (!messages || messages.length === 0) {
    return;
  }

  console.log(`Recovered ${messages.length} pending telemetry messages`);

  for (const [id, fields] of messages) {
    if (!fields) {
      console.error(`Missing fields in Redis message ${id}`);
      continue;
    }

    const dataIndex = fields.indexOf("data");

    if (dataIndex === -1 || !fields[dataIndex + 1]) {
      console.error(`Missing data field in Redis message ${id}`);
      continue;
    }

    const data = JSON.parse(fields[dataIndex + 1]);

    buffer.push({
      id,
      log: {
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
      },
    });

    if (buffer.length === 1) {
      startFlushTimer();
    }

    if (buffer.length >= BATCH_SIZE) {
      await flushBuffer();
    }
  }
}
