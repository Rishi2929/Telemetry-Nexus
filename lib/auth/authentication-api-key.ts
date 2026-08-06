import type { ApiKey } from "@/app/generated/prisma/client";
import { verifyApiKey } from "./api-key";
import { prisma } from "../db/prisma";

export async function authenticateApiKey(request: Request): Promise<ApiKey> {
  const authorization = request.headers.get("Authorization");

  if (!authorization) {
    throw new Error("Missing Authorization header");
  }

  if (!authorization.startsWith("Bearer ")) {
    throw new Error("Invalid Authorization header");
  }

  const apiKey = authorization.substring(7);

  const parts = apiKey.split("_");

  if (parts.length !== 4) {
    throw new Error("Invalid API key format");
  }

  const [prefix, environment, publicId, secret] = parts;

  if (prefix !== "tn" || environment !== "live") {
    throw new Error("Invalid API key format");
  }

  const apiKeyRecord = await prisma.apiKey.findUnique({
    where: {
      publicId,
    },
  });

  if (!apiKeyRecord) {
    throw new Error("Invalid API key");
  }

  if (!apiKeyRecord.active) {
    throw new Error("API key is inactive");
  }

  const now = new Date();

  if (apiKeyRecord.expiresAt && apiKeyRecord.expiresAt < now) {
    throw new Error("API key has expired");
  }

  const isValid = await verifyApiKey(secret, apiKeyRecord.keyHash);

  if (!isValid) {
    throw new Error("Invalid API key");
  }

  await prisma.apiKey.update({
    where: {
      id: apiKeyRecord.id,
    },
    data: {
      lastUsedAt: now,
    },
  });

  return apiKeyRecord;
}
