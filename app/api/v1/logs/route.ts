import { authenticateApiKey } from "@/lib/auth/authentication-api-key";
import { createApiLog } from "@/lib/db/api-log";
import { logSchema } from "@/lib/validation/log-schema";

export async function POST(request: Request) {
  try {
    const apiKey = await authenticateApiKey(request);
    const body = await request.json();
    const data = logSchema.parse(body);
    await createApiLog(apiKey.projectId, data);
    return Response.json({ success: true }, { status: 201 });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }
}
