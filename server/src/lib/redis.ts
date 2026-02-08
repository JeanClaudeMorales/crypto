import Redis from 'ioredis';
import { env } from './env.js';

let redis: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redis) {
    const redisUrl = env.REDIS_URL || 'redis://localhost:6379';
    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      reconnectOnError(err) {
        console.error('Redis connection error:', err.message);
        return true;
      }
    });

    redis.on('connect', () => console.log('✅ Redis connected'));
    redis.on('error', (err) => console.error('❌ Redis error:', err));
  }

  return redis;
}

export async function closeRedis() {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}
