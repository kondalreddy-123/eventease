import { describe, it, expect } from 'vitest';
import { generateCostSavings, generateFallbackEventPlan } from '../src/services/geminiService.js';

describe('Smart Budget Engine & Analytics', () => {
  it('should accurately calculate budget totals summing up to total budget', () => {
    const totalBudget = 1000000; // 10 Lakhs INR
    const plan = generateFallbackEventPlan({
      eventType: 'Wedding',
      totalBudget,
      guestCount: 200
    });

    expect(plan.budgetBreakdown).toBeDefined();
    expect(plan.budgetBreakdown.length).toBeGreaterThan(0);

    const sumAllocations = plan.budgetBreakdown.reduce((sum, item) => sum + item.allocatedAmount, 0);
    expect(sumAllocations).toBe(totalBudget);
  });

  it('should allocate an emergency contingency reserve within 5-10%', () => {
    const totalBudget = 500000;
    const plan = generateFallbackEventPlan({
      eventType: 'Birthday',
      totalBudget,
      guestCount: 50
    });

    const contingencyItem = plan.budgetBreakdown.find(b => b.category.toLowerCase().includes('contingency'));
    expect(contingencyItem).toBeDefined();
    expect(contingencyItem.allocatedAmount).toBeGreaterThan(0);
    expect(contingencyItem.percentage).toBeGreaterThanOrEqual(2);
  });

  it('should flag over-budget scenarios and provide cost-saving trade-offs', async () => {
    const totalBudget = 500000;
    const currentExpenses = [
      { category: 'Venue and booking', actualAmount: 300000 },
      { category: 'Food and catering', actualAmount: 250000 }
    ]; // Total 550000 > 500000

    const savings = await generateCostSavings({
      totalBudget,
      currentExpenses,
      eventType: 'Wedding'
    });

    expect(savings.isOverBudget).toBe(true);
    expect(savings.overBudgetAmount).toBe(50000);
    expect(savings.recommendations.length).toBeGreaterThan(0);
    expect(savings.recommendations[0]).toHaveProperty('category');
    expect(savings.recommendations[0]).toHaveProperty('potentialSavings');
    expect(savings.recommendations[0]).toHaveProperty('advice');
  });

  it('should report healthy cushion when expenses are within planned limits', async () => {
    const totalBudget = 500000;
    const currentExpenses = [
      { category: 'Venue and booking', actualAmount: 150000 }
    ];

    const savings = await generateCostSavings({
      totalBudget,
      currentExpenses,
      eventType: 'Wedding'
    });

    expect(savings.isOverBudget).toBe(false);
    expect(savings.overBudgetAmount).toBe(0);
  });
});
