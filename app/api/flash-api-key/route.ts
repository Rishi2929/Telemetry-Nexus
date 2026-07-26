import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();

  const apiKey = cookieStore.get("new-api-key")?.value;

  if (apiKey) {
    cookieStore.delete("new-api-key");
  }

  return NextResponse.json({
    apiKey: apiKey ?? null,
  });
}