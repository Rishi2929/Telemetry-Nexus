export type MonitorOptions = {
  apiKey: string;
  endpoint: string;
};

export type TelemetryPayload = {
  level: "TRACE" | "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL";

  message: string;

  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

  endpoint: string;

  environment: "PRODUCTION" | "STAGING" | "DEVELOPMENT";

  statusCode: number;

  latency: number;

  metadata?: Record<string, unknown>;
};
