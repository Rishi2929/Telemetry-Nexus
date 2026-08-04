import { authenticateApiKey } from "@/lib/authentication-api-key";

export async function POST(request: Request) {
  try {
    const apiKey = await authenticateApiKey(request);

    return Response.json({
      authenticated: true,
      projectId: apiKey.projectId,
    });
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
