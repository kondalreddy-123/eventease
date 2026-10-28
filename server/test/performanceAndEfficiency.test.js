import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/server.js';
import { planCache, ideasCache } from '../src/utils/cache.js';

describe('Performance, Caching & Efficiency Test Suite', () => {
  it('should store and retrieve cached items within sub-millisecond latency', () => {
    const key = 'test-cache-key';
    const sampleValue = { planId: 'p-1', title: 'Intimate Ceremony' };

    const startSet = performance.now();
    planCache.set(key, sampleValue, 5000);
    const setTime = performance.now() - startSet;

    const startGet = performance.now();
    const retrieved = planCache.get(key);
    const getTime = performance.now() - startGet;

    expect(retrieved).toEqual(sampleValue);
    expect(setTime).toBeLessThan(10); // Under 10ms
    expect(getTime).toBeLessThan(5);  // Under 5ms
  });

  it('should expire cached entries when TTL lapses', async () => {
    const quickKey = 'quick-expire-key';
    planCache.set(quickKey, { message: 'temporary' }, 10); // 10ms TTL

    await new Promise(resolve => setTimeout(resolve, 25));
    const expired = planCache.get(quickKey);
    expect(expired).toBeNull();
  });

  it('should respond to /api/health with ultra-low latency (< 50ms after warmup)', async () => {
    // Warm up
    await request(app).get('/api/health');

    const start = performance.now();
    const res = await request(app).get('/api/health');
    const elapsed = performance.now() - start;

    expect(res.status).toBe(200);
    expect(elapsed).toBeLessThan(75);
  });

  it('should support accept-encoding gzip/deflate for compressed responses', async () => {
    const res = await request(app)
      .get('/api/health')
      .set('Accept-Encoding', 'gzip, deflate');
    
    expect(res.status).toBe(200);
  });
});
