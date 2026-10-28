import { describe, it, expect } from 'vitest';
import { generateFallbackEventPlan } from '../src/services/geminiService.js';

describe('AI Event Plan Synthesis & Schema Validation', () => {
  it('should generate a complete structured plan for Wedding', () => {
    const eventDate = '2026-12-15';
    const plan = generateFallbackEventPlan({
      eventType: 'Wedding',
      name: 'Pooja & Sameer Wedding',
      eventDate,
      location: 'Udaipur',
      guestCount: 250,
      totalBudget: 2000000
    });

    expect(plan.theme).toBeDefined();
    expect(plan.theme.title).toBeTruthy();
    expect(plan.theme.colorPalette).toBeInstanceOf(Array);
    expect(plan.theme.colorPalette.length).toBe(5);

    expect(plan.venueAndCatering).toBeDefined();
    expect(plan.venueAndCatering.venueAdvice).toContain('Udaipur');
    expect(plan.venueAndCatering.cateringHighlights.length).toBeGreaterThan(0);

    expect(plan.entertainment.length).toBeGreaterThan(0);
    expect(plan.guestManagement.length).toBeGreaterThan(0);
    expect(plan.timeline.length).toBeGreaterThanOrEqual(5);

    // Verify timeline due dates are on or before eventDate
    plan.timeline.forEach(step => {
      expect(new Date(step.dueDate).getTime()).toBeLessThanOrEqual(new Date(eventDate).getTime());
    });

    expect(plan.vendorChecklist.length).toBeGreaterThanOrEqual(4);
    expect(plan.contingencyAndRisks.length).toBeGreaterThanOrEqual(2);
  });

  it('should generate age-calibrated party recommendations for Birthday', () => {
    const plan = generateFallbackEventPlan({
      eventType: 'Birthday',
      name: 'Leo 10th Birthday Adventure',
      eventDate: '2026-11-10',
      location: 'Bengaluru',
      guestCount: 40,
      totalBudget: 100000
    });

    expect(plan.theme.title).toBeTruthy();
    expect(plan.budgetBreakdown.some(b => b.category.includes('Food'))).toBe(true);
    expect(plan.timeline.length).toBeGreaterThan(0);
  });

  it('should generate volunteer and permit-focused plans for Community Event', () => {
    const plan = generateFallbackEventPlan({
      eventType: 'Community',
      name: 'Neighborhood Green Fair',
      eventDate: '2026-10-30',
      location: 'Pune',
      guestCount: 500,
      totalBudget: 350000
    });

    expect(plan.theme.title).toBeTruthy();
    expect(plan.theme.colorPalette).toHaveLength(5);
    expect(plan.budgetBreakdown.some(b => b.category.includes('Emergency contingency'))).toBe(true);
  });
});
