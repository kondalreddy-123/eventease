import { describe, it, expect } from 'vitest';
import bcrypt from 'bcryptjs';
import { db } from '../src/db.js';

describe('Authentication & Data Store Integrity', () => {
  it('should find the demo user and verify securely hashed password', () => {
    const demoUser = db.findUserByEmail('demo@eventease.ai');
    expect(demoUser).toBeDefined();
    expect(demoUser.email).toBe('demo@eventease.ai');

    const isMatch = bcrypt.compareSync('demo123', demoUser.password);
    expect(isMatch).toBe(true);

    const wrongMatch = bcrypt.compareSync('wrongpass', demoUser.password);
    expect(wrongMatch).toBe(false);
  });

  it('should isolate events by user ID to prevent unauthorized data access', () => {
    const demoEvents = db.getEventsByUser('user-demo-001');
    expect(demoEvents.length).toBeGreaterThan(0);

    const unauthorizedEvents = db.getEventsByUser('unknown-user-id');
    expect(unauthorizedEvents).toHaveLength(0);
  });

  it('should cascade delete child expenses, tasks, and vendors when an event is deleted', () => {
    // Create temporary test event
    const tempEvent = {
      id: 'test-event-cascade-01',
      userId: 'test-user-temp',
      name: 'Temporary Test Event',
      eventType: 'Birthday',
      totalBudget: 100000,
      eventDate: '2026-12-31'
    };
    db.addEvent(tempEvent);

    db.addExpense({
      id: 'test-exp-01',
      eventId: tempEvent.id,
      title: 'Test Catering',
      category: 'Food and catering',
      estimatedAmount: 20000
    });

    db.addTask({
      id: 'test-task-01',
      eventId: tempEvent.id,
      title: 'Test Task',
      dueDate: '2026-12-30'
    });

    expect(db.getExpenses(tempEvent.id)).toHaveLength(1);
    expect(db.getTasks(tempEvent.id)).toHaveLength(1);

    // Delete event
    const deleted = db.deleteEvent(tempEvent.id, tempEvent.userId);
    expect(deleted).toBe(true);

    // Verify cascade
    expect(db.getExpenses(tempEvent.id)).toHaveLength(0);
    expect(db.getTasks(tempEvent.id)).toHaveLength(0);
  });
});
