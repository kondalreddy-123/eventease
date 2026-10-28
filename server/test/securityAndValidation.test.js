import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/server.js';
import { sanitizeString, isValidEmail, isValidPassword } from '../src/utils/sanitize.js';

describe('Security & Validation Test Suite', () => {
  it('should enforce 401 Unauthorized when Authorization header is absent', async () => {
    const res = await request(app).get('/api/events');
    expect(res.status).toBe(401);
    expect(res.body.message).toContain('Authentication required');
  });

  it('should reject forged or malformed JWT tokens with 401', async () => {
    const res = await request(app)
      .get('/api/events')
      .set('Authorization', 'Bearer invalid.forged.token');
    expect(res.status).toBe(401);
    expect(res.body.message).toContain('invalid token');
  });

  it('should reject user registration with invalid email format', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Valid Name',
        email: 'invalid-email-no-at-sign',
        password: 'password123'
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('valid email');
  });

  it('should reject registration if password is under 6 characters', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Valid Name',
        email: 'shortpass@example.com',
        password: '123'
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('at least 6 characters');
  });

  it('should sanitize dangerous HTML tags and script injections', () => {
    const dangerousInput = '<script>alert("xss")</script><b>Wedding Decor</b>';
    const clean = sanitizeString(dangerousInput);
    expect(clean).not.toContain('<script>');
    expect(clean).not.toContain('</script>');
    expect(clean).not.toContain('<b>');
    expect(clean).toContain('Wedding Decor');
  });

  it('should validate emails correctly with isValidEmail', () => {
    expect(isValidEmail('test@eventease.ai')).toBe(true);
    expect(isValidEmail('user.name+tag@sub.domain.co.in')).toBe(true);
    expect(isValidEmail('plainaddress')).toBe(false);
    expect(isValidEmail('@missingusername.com')).toBe(false);
  });

  it('should validate passwords correctly with isValidPassword', () => {
    expect(isValidPassword('secure123')).toBe(true);
    expect(isValidPassword('short')).toBe(false);
  });

  it('should include Helmet security headers in HTTP responses', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
  });

  it('should provide rate limiting headers on API routes', async () => {
    const res = await request(app).get('/api/health');
    // Express-rate-limit standardHeaders: ratelimit-limit, ratelimit-remaining
    expect(res.headers['ratelimit-limit'] || res.headers['x-ratelimit-limit']).toBeDefined();
  });
});
