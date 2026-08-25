// This code is responsible for creating a single, reusbalbe Redis database client in Next.js
// that survives hot reloading during local development without exhausting db connections.
//
import Redis from "ioredis";

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

export const redis = globalForRedis.redis ?? new Redis(process.env.REDIS_URL!);

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}
