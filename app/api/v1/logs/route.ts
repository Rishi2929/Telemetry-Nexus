import { ZodError } from "zod";

import { logSchema } from "@/lib/validation/log-schema";
import { createApiLog } from "@/lib/db/api-log";
import { authenticateApiKey } from "@/lib/auth/authentication-api-key";
import { publishTelemetry } from "@/lib/redis/telemetry-stream";

export async function POST(request: Request) {
  try {
    const apiKey = await authenticateApiKey(request);

    const body = await request.json();

    const data = logSchema.parse(body);

    await publishTelemetry({
      projectId: apiKey.projectId,
      ...data,
      createdAt: new Date().toISOString(),
    });

    return Response.json(
      {
        success: true,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json(
        {
          error: error.issues,
        },
        {
          status: 400,
        },
      );
    }

    if (error instanceof Error) {
      return Response.json(
        {
          error: error.message,
        },
        {
          status: 401,
        },
      );
    }

    return Response.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
