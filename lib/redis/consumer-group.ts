import { redis } from "./client";
import { TELEMETRY_STREAM } from "./telemetry-stream";

export const TELEMETRY_CONSUMER_GROUP = "telemetry-workers";

export async function ensureTelemetryConsumerGroup() {
  try {
    await redis.xgroup("CREATE", TELEMETRY_STREAM, TELEMETRY_CONSUMER_GROUP, "0", "MKSTREAM");

    console.log(`Redis consumer group "${TELEMETRY_CONSUMER_GROUP}" created`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (message.includes("BUSYGROUP")) {
      console.log(`Redis consumer group "${TELEMETRY_CONSUMER_GROUP}" already exists`);

      return;
    }

    throw error;
  }
}
