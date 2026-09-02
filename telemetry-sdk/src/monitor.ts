import type { Request, Response, NextFunction } from "express";

import type { MonitorOptions, TelemetryPayload } from "./types";
import { sendTelemetry } from "./sender";
import { randomUUID } from "crypto";

function getLogLevel(statusCode: number): TelemetryPayload["level"] {
  if (statusCode >= 500) {
    return "ERROR";
  }
  if (statusCode >= 400) {
    return "WARN";
  }

  return "INFO";
}

export function monitor(options: MonitorOptions) {
  return function telemetryMiddleware(request: Request, response: Response, next: NextFunction) {
    const startTime = Date.now();
    const requestId = randomUUID();

    response.on("finish", async () => {
      const latency = Date.now() - startTime;

      const telemetry: TelemetryPayload = {
        requestId,

        level: getLogLevel(response.statusCode),

        message: `${request.method} ${request.originalUrl}`,

        method: request.method as TelemetryPayload["method"],

        endpoint: request.originalUrl,

        environment: "PRODUCTION",

        statusCode: response.statusCode,

        latency,

        metadata: {},
      };
      try {
        console.log(telemetry);
        await sendTelemetry(options, telemetry);
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Failed to send telemetry:", error);
        }
      }
    });

    next();
  };
}
