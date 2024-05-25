import { Redis } from "ioredis";
import { rdb } from "./rdb";

interface IRatelimit {
  key: string;
  limit: number;
  duration: number;
  db?: Redis;
}

export async function isRatelimited(p: IRatelimit): Promise<boolean> {
  const { key, limit, duration, db = rdb } = p;
  const current = await db.get(key);
  if (current === null) {
    await db.set(key, 1, "EX", duration);
    return false;
  }
  if (parseInt(current) >= limit) {
    return true;
  }
  await db.incr(key);
  return false;
}
