import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { generateEventPlan, generateIdeas, generateCostSavings } from '../services/geminiService.js';
import { db } from '../db.js';
import { planCache, ideasCache, savingsCache } from '../utils/cache.js';

const router = express.Router();
router.use(requireAuth);

// Generate or Regenerate Event Plan
router.post('/generate-plan', async (req, res) => {
  try {
    const { eventId, eventData } = req.body;

    let targetData = eventData;
    if (eventId && !targetData) {
      const event = db.getEventById(eventId, req.user.id);
      if (!event) return res.status(404).json({ message: 'Event not found' });
      targetData = event;
    }

    if (!targetData || !targetData.name) {
      return res.status(400).json({ message: 'Valid event data is required for AI generation.' });
    }

    // Check cache
    const cacheKey = planCache.generateKey('plan', {
      name: targetData.name,
      type: targetData.eventType,
      budget: targetData.totalBudget,
      guests: targetData.guestCount,
      theme: targetData.theme
    });

    let plan = planCache.get(cacheKey);
    let fromCache = false;

    if (!plan) {
      plan = await generateEventPlan(targetData);
      planCache.set(cacheKey, plan);
    } else {
      fromCache = true;
    }

    // If eventId was passed, persist this updated plan
    if (eventId) {
      db.updateEvent(eventId, { aiPlan: plan }, req.user.id);
    }

    res.json({
      message: 'Event plan generated successfully!',
      fromCache,
      plan
    });
  } catch (err) {
    console.error('Plan generation failed:', err);
    res.status(500).json({ message: 'Failed to generate event plan.', error: err.message });
  }
});

// Generate Personalized AI Ideas
router.post('/generate-ideas', async (req, res) => {
  try {
    const { eventType, topic, guestCount, budget, theme } = req.body;
    const cacheKey = ideasCache.generateKey('ideas', { eventType, topic, guestCount, budget, theme });

    let ideas = ideasCache.get(cacheKey);
    let fromCache = false;

    if (!ideas) {
      ideas = await generateIdeas({ eventType, topic, guestCount, budget, theme });
      ideasCache.set(cacheKey, ideas);
    } else {
      fromCache = true;
    }

    res.json({ ideas, fromCache });
  } catch (err) {
    console.error('Ideas generation failed:', err);
    res.status(500).json({ message: 'Failed to generate ideas.', error: err.message });
  }
});

// Generate Cost-Saving Recommendations
router.post('/cost-savings', async (req, res) => {
  try {
    const { eventId, totalBudget } = req.body;
    let budget = totalBudget;
    let expenses = [];
    let eventType = 'Wedding';

    if (eventId) {
      const event = db.getEventById(eventId, req.user.id);
      if (event) {
        budget = event.totalBudget;
        eventType = event.eventType;
        expenses = db.getExpenses(eventId);
      }
    }

    const savings = await generateCostSavings({
      totalBudget: budget,
      currentExpenses: expenses,
      eventType
    });

    res.json(savings);
  } catch (err) {
    console.error('Cost savings calculation failed:', err);
    res.status(500).json({ message: 'Failed to compute cost savings.', error: err.message });
  }
});

export default router;
