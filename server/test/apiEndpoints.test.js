import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/server.js';

describe('API Endpoints & Full Lifecycle Integration Suite', () => {
  let authToken = '';
  let testEventId = '';
  let testExpenseId = '';
  let testTaskId = '';
  let testVendorId = '';

  it('GET /api/health should respond with healthy status and metadata', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.service).toContain('EventEase AI');
  });

  it('POST /api/auth/demo should authenticate and provide a valid JWT token', async () => {
    const res = await request(app).post('/api/auth/demo');
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe('demo@eventease.ai');
    authToken = res.body.token;
  });

  it('GET /api/auth/me should return authenticated user profile', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('demo@eventease.ai');
  });

  it('POST /api/events should create a new event with AI initialized plan', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Grand Silver Anniversary Celebration',
        eventType: 'Community',
        eventDate: '2026-11-20',
        location: 'Hyderabad, India',
        guestCount: 250,
        totalBudget: 400000,
        theme: 'Silver Elegance & Warm Lights'
      });

    expect(res.status).toBe(201);
    expect(res.body.event).toBeDefined();
    expect(res.body.event.name).toBe('Grand Silver Anniversary Celebration');
    expect(res.body.event.aiPlan).toBeDefined();
    testEventId = res.body.event.id;
  });

  it('GET /api/events should list all events for the authenticated user', async () => {
    const res = await request(app)
      .get('/api/events')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.events)).toBe(true);
    const found = res.body.events.find(e => e.id === testEventId);
    expect(found).toBeDefined();
    expect(found.totalTasks).toBeGreaterThan(0);
  });

  it('GET /api/events/:id should return the event with tasks, expenses, vendors', async () => {
    const res = await request(app)
      .get(`/api/events/${testEventId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body.event.id).toBe(testEventId);
    expect(Array.isArray(res.body.tasks)).toBe(true);
    expect(Array.isArray(res.body.expenses)).toBe(true);
  });

  it('POST /api/events/:id/expenses should record an expense item', async () => {
    const res = await request(app)
      .post(`/api/events/${testEventId}/expenses`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Floral Archway & Stage Setup',
        category: 'Decoration',
        estimatedAmount: 35000,
        actualAmount: 32000,
        status: 'Paid',
        notes: 'Handcrafted floral design'
      });
    expect(res.status).toBe(201);
    expect(res.body.expense.title).toBe('Floral Archway & Stage Setup');
    testExpenseId = res.body.expense.id;
  });

  it('PUT /api/events/:id/expenses/:expId should update an expense', async () => {
    const res = await request(app)
      .put(`/api/events/${testEventId}/expenses/${testExpenseId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ actualAmount: 33500, status: 'Paid' });
    expect(res.status).toBe(200);
    expect(res.body.expense.actualAmount).toBe(33500);
  });

  it('POST /api/events/:id/tasks should add a milestone task', async () => {
    const res = await request(app)
      .post(`/api/events/${testEventId}/tasks`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Finalize Lighting & Sound Checklist',
        category: 'Audio/Visual',
        priority: 'High',
        dueDate: '2026-11-15'
      });
    expect(res.status).toBe(201);
    expect(res.body.task.completed).toBe(false);
    testTaskId = res.body.task.id;
  });

  it('PUT /api/events/:id/tasks/:taskId should toggle task completion', async () => {
    const res = await request(app)
      .put(`/api/events/${testEventId}/tasks/${testTaskId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ completed: true });
    expect(res.status).toBe(200);
    expect(res.body.task.completed).toBe(true);
  });

  it('POST /api/events/:id/vendors should add a partner vendor', async () => {
    const res = await request(app)
      .post(`/api/events/${testEventId}/vendors`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Royal Feast Catering Services',
        category: 'Catering',
        contactPerson: 'Master Chef Sharma',
        phone: '+91 99887 76655',
        quotedPrice: 120000,
        agreedPrice: 110000,
        paymentStatus: 'Advance Paid',
        bookingStatus: 'Confirmed'
      });
    expect(res.status).toBe(201);
    expect(res.body.vendor.name).toBe('Royal Feast Catering Services');
    testVendorId = res.body.vendor.id;
  });

  it('DELETE /api/events/:id should cleanly delete event', async () => {
    const res = await request(app)
      .delete(`/api/events/${testEventId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('deleted');
  });
});
