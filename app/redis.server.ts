import { createClient } from 'redis';

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.connect().then(() => {
  console.log('🔌 Redis connected');
});

export async function getDataFromCache<T>(key: string): Promise<T | null> {
  const result = await redisClient.get(key);

  if (!result) return null;

  return JSON.parse(result) as T;
}

export async function saveDataToCache(items: unknown, key: string) {
  await redisClient.set(key, JSON.stringify(items));
}
