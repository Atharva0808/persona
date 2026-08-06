import { Redis } from "@upstash/redis";

// In-Memory Fallback Cache for local development without Upstash Redis credentials
class MemoryCache {
  private cache = new Map<string, { value: unknown; expiresAt: number }>();

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return item.value as T;
  }

  async set(key: string, value: unknown, options?: { ex?: number }): Promise<void> {
    const ttlMs = (options?.ex || 86400) * 1000;
    this.cache.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
  }
}

const memoryCache = new MemoryCache();

export const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : memoryCache;
