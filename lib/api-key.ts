import { randomBytes } from "crypto";
import argon2 from "argon2";
import { nanoid } from "nanoid";

export function generatePublicApiKeyId() {
  return nanoid(10);
}

export function generateApiKey() {
  const publicId = generatePublicApiKeyId();

  const secret = randomBytes(32).toString("hex");

  const apiKey = `tn_live_${publicId}_${secret}`;

  return {
    publicId,
    secret,
    apiKey,
  };
}

export async function hashApiKey(secret: string) {
  return argon2.hash(secret);
}

export async function verifyApiKey(secret: string, hash: string) {
  return argon2.verify(hash, secret);
}

export async function createApiKey() {
  const { publicId, secret, apiKey } = generateApiKey();

  const keyHash = await hashApiKey(secret);

  return {
    publicId,
    keyHash,
    apiKey,
  };
}
