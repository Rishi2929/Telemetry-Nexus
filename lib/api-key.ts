import { randomBytes } from "crypto";
import argon2 from "argon2";

export function generateApiKey()  {
    const random = randomBytes(32).toString("hex");
    return `tn_live_${random}`;
}

export async function hashApiKey(apiKey: string) {
    return argon2.hash(apiKey);
}

export async function verifyApiKey(apiKey : string , hash : string) {
    return argon2.verify(hash, apiKey)
}