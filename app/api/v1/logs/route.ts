export async function POST(request: Request) {
  const authorization = request.headers.get("Authorization");

  if (!authorization) {
    return Response.json(
      {
        error: "Missing Authorization header",
      },
      {
        status: 401,
      }
    );
  }

  if (!authorization.startsWith("Bearer ")) {
    return Response.json(
      {
        error: "Invalid Authorization header",
      },
      {
        status: 401,
      }
    );
  }

  const apiKey = authorization.substring(7);

  return Response.json({
    apiKey,
  });
}
