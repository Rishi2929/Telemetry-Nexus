import { redis } from "./client";

export const TELEMETRY_STREAM = "telemetry";
export const TELEMETRY_GROUP = "telemetry-workers";
export const TELEMETRY_CONSUMER = `worker-${process.pid}`;

type TelemetryStreamData = {
  projectId: string;
  requestId?: string;
  level: string;
  message: string;
  method: string;
  endpoint: string;
  environment: string;
  statusCode: number;
  latency: number;
  ipAddress?: string;
  userAgent?: string;
  metadata?: unknown;
  createdAt: string;
};

export async function getTelemetryStreamLength() {
  return redis.xlen(TELEMETRY_STREAM);
}

// This is the producer
export async function publishTelemetry(data: TelemetryStreamData) {
  await redis.xadd(TELEMETRY_STREAM, "*", "data", JSON.stringify(data));
}
