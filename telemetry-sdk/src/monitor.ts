import type { Request, Response, NextFunction } from "express";

import type { MonitorOptions, TelemetryPayload } from "./types";
import { sendTelemetry } from "./sender";

export function monitor(options: MonitorOptions) {
  return function telemetryMiddleware(request: Request, response: Response, next: NextFunction) {
    const startTime = Date.now();

    response.on("finish", async () => {
      const latency = Date.now() - startTime;

      const telemetry: TelemetryPayload = {
        level: "INFO",

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
