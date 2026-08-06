import z from "zod";

export const logSchema = z.object({
  level: z.enum(["TRACE", "DEBUG", "INFO", "WARN", "ERROR", "FATAL"]),
  message: z.string().min(1),

  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  endpoint: z.string().min(1),

  environment: z.enum(["PRODUCTION", "STAGING", "DEVELOPMENT"]),

  statusCode: z.number().int(),
  latency: z.number(),

  requestId: z.string().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),

  // metaData: z.record(z.string(), z.any().default({})),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type LogSchema = z.infer<typeof logSchema>;
