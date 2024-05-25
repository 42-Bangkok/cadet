import { Redis } from "ioredis";

declare global {
  interface Global {
    redisClient?: Redis;
  }
}

const globalForRedis = global as Global;

const REDIS_URI = process.env.REDIS_URI ?? "";

export const rdb =
  (globalForRedis.redisClient as Redis) ?? new Redis(REDIS_URI);

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redisClient = rdb as Redis;
}
