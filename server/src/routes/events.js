import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { generateFallbackEventPlan } from '../services/geminiService.js';
import { sanitizeString, validatePositiveNumber } from '../utils/sanitize.js';

const router = express.Router();
router.use(requireAuth);

// ---------------- EVENTS ----------------

// Get all events for user
router.get('/', (req, res) => {
  const events = db.getEventsByUser(req.user.id);

  // Attach quick summary stats to each event
  const enriched = events.map(evt => {
    const expenses = db.getExpenses(evt.id);
    const tasks = db.getTasks(evt.id);
    const vendors = db.getVendors(evt.id);

    const totalSpent = expenses.reduce((s, e) => s + (Number(e.actualAmount) || Number(e.estimatedAmount) || 0), 0);
    const completedTasks = tasks.filter(t => t.completed).length;

    return {
      ...evt,
      totalSpent,
      totalTasks: tasks.length,
      completedTasks,
      totalVendors: vendors.length
    };
  });

  res.json({ events: enriched });
});

// Get single event by id with all child collections
router.get('/:id', (req, res) => {
  const event = db.getEventById(req.params.id, req.user.id);
  if (!event) {
    return res.status(404).json({ message: 'Event not found or unauthorized access.' });
  }

  const tasks = db.getTasks(event.id);
  const expenses = db.getExpenses(event.id);
  const vendors = db.getVendors(event.id);
  const savedIdeas = db.getIdeas(event.id);

  res.json({
    event,
    tasks,
    expenses,
    vendors,
    savedIdeas
  });
});

// Create new event
router.post('/', (req, res) => {
  const {
    name,
    eventType = 'Wedding',
    description = '',
    eventDate,
    location,
    guestCount = 100,
    totalBudget = 500000,
    theme = '',
    foodPreference = '',
    culturalPreference = '',
    venuePreference = '',
    specialRequirements = '',
    autoGenerateAI = true
  } = req.body;

  if (!name || !eventDate || !location) {
    return res.status(400).json({ message: 'Event name, date, and location are required.' });
  }

  const cleanName = sanitizeString(name);
  const cleanDescription = sanitizeString(description);
  const cleanLocation = sanitizeString(location);
  const cleanTheme = sanitizeString(theme);
  const cleanFood = sanitizeString(foodPreference);
  const cleanCultural = sanitizeString(culturalPreference);
  const cleanVenue = sanitizeString(venuePreference);
  const cleanReqs = sanitizeString(specialRequirements);
  const cleanGuestCount = validatePositiveNumber(guestCount, 100);
  const cleanTotalBudget = validatePositiveNumber(totalBudget, 500000);

  const eventId = `event-${uuidv4().slice(0, 8)}`;
  
  // Create preliminary plan
  const plan = generateFallbackEventPlan({
    name: cleanName,
    eventType: sanitizeString(eventType) || 'Wedding',
    description: cleanDescription,
    eventDate,
    location: cleanLocation,
    guestCount: cleanGuestCount,
    totalBudget: cleanTotalBudget,
    theme: cleanTheme,
    foodPreference: cleanFood,
    culturalPreference: cleanCultural,
    venuePreference: cleanVenue,
    specialRequirements: cleanReqs
  });

  const newEvent = {
    id: eventId,
    userId: req.user.id,
    name: cleanName,
    eventType: sanitizeString(eventType) || 'Wedding',
    description: cleanDescription,
    eventDate,
    location: cleanLocation,
    guestCount: cleanGuestCount,
    totalBudget: cleanTotalBudget,
    theme: cleanTheme,
    foodPreference: cleanFood,
    culturalPreference: cleanCultural,
    venuePreference: cleanVenue,
    specialRequirements: cleanReqs,
    aiPlan: plan,
    createdAt: new Date().toISOString()
  };

  db.addEvent(newEvent);

  // Populate initial budget expenses from plan
  if (plan.budgetBreakdown && Array.isArray(plan.budgetBreakdown)) {
    plan.budgetBreakdown.forEach((item, idx) => {
      db.addExpense({
        id: `exp-${uuidv4().slice(0, 8)}`,
        eventId,
        title: `${item.category} (Allocated)`,
        category: item.category,
        estimatedAmount: item.allocatedAmount,
        actualAmount: 0,
        status: 'Unpaid',
        notes: item.reason || '',
        createdAt: new Date().toISOString()
      });
    });
  }

  // Populate initial timeline tasks from plan
  if (plan.timeline && Array.isArray(plan.timeline)) {
    plan.timeline.forEach((milestoneItem) => {
      if (milestoneItem.tasks && Array.isArray(milestoneItem.tasks)) {
        milestoneItem.tasks.forEach((tTitle) => {
          db.addTask({
            id: `task-${uuidv4().slice(0, 8)}`,
            eventId,
            title: tTitle,
            category: milestoneItem.title || 'General',
            milestone: milestoneItem.milestone || 'Planning',
            dueDate: milestoneItem.dueDate || eventDate,
            priority: milestoneItem.priority || 'Medium',
            completed: false,
            assignedTo: 'Lead Planner',
            notes: `Milestone phase: ${milestoneItem.title}`
          });
        });
      }
    });
  }

  // Populate sample starter vendors
  if (plan.vendorChecklist && Array.isArray(plan.vendorChecklist)) {
    plan.vendorChecklist.slice(0, 3).forEach((item) => {
      db.addVendor({
        id: `ven-${uuidv4().slice(0, 8)}`,
        eventId,
        name: `${item.category} Partner (Suggested)`,
        category: item.category,
        contactPerson: 'Booking Manager',
        phone: '+91 98000 00000',
        email: `inquiries@${item.category.toLowerCase().replace(/\s+/g, '')}.com`,
        quotedPrice: Math.round((Number(totalBudget) * 0.15) || 50000),
        agreedPrice: 0,
        paymentStatus: 'Unpaid',
        bookingStatus: 'Inquiry',
        rating: 4.8,
        services: item.action || 'Full event coordination services',
        notes: 'AI suggested checklist entry. Please update with your chosen local vendor.',
        isSample: true
      });
    });
  }

  res.status(201).json({
    message: 'Event created and plan initialized successfully!',
    event: newEvent
  });
});

// Update event
router.put('/:id', (req, res) => {
  const updated = db.updateEvent(req.params.id, req.body, req.user.id);
  if (!updated) {
    return res.status(404).json({ message: 'Event not found or unauthorized' });
  }
  res.json({ message: 'Event updated successfully', event: updated });
});

// Delete event
router.delete('/:id', (req, res) => {
  const success = db.deleteEvent(req.params.id, req.user.id);
  if (!success) {
    return res.status(404).json({ message: 'Event not found or unauthorized' });
  }
  res.json({ message: 'Event deleted successfully' });
});

// ---------------- EXPENSES ----------------

router.get('/:id/expenses', (req, res) => {
  const event = db.getEventById(req.params.id, req.user.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json({ expenses: db.getExpenses(req.params.id) });
});

router.post('/:id/expenses', (req, res) => {
  const event = db.getEventById(req.params.id, req.user.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  const { title, category, estimatedAmount, actualAmount = 0, status = 'Unpaid', notes = '' } = req.body;
  if (!title || !category) {
    return res.status(400).json({ message: 'Expense title and category are required.' });
  }

  const newExpense = {
    id: `exp-${uuidv4().slice(0, 8)}`,
    eventId: req.params.id,
    title: sanitizeString(title),
    category: sanitizeString(category),
    estimatedAmount: validatePositiveNumber(estimatedAmount, 0),
    actualAmount: validatePositiveNumber(actualAmount, 0),
    status: sanitizeString(status) || 'Unpaid',
    notes: sanitizeString(notes),
    createdAt: new Date().toISOString()
  };

  db.addExpense(newExpense);
  res.status(201).json({ message: 'Expense added', expense: newExpense });
});

router.put('/:id/expenses/:expId', (req, res) => {
  const updated = db.updateExpense(req.params.expId, req.body);
  if (!updated) return res.status(404).json({ message: 'Expense not found' });
  res.json({ message: 'Expense updated', expense: updated });
});

router.delete('/:id/expenses/:expId', (req, res) => {
  const success = db.deleteExpense(req.params.expId);
  if (!success) return res.status(404).json({ message: 'Expense not found' });
  res.json({ message: 'Expense deleted' });
});

// ---------------- TASKS ----------------

router.get('/:id/tasks', (req, res) => {
  const event = db.getEventById(req.params.id, req.user.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json({ tasks: db.getTasks(req.params.id) });
});

router.post('/:id/tasks', (req, res) => {
  const event = db.getEventById(req.params.id, req.user.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  const { title, category = 'General', milestone = 'Preparation', dueDate, priority = 'Medium', notes = '', assignedTo = '' } = req.body;
  if (!title) return res.status(400).json({ message: 'Task title is required.' });

  const newTask = {
    id: `task-${uuidv4().slice(0, 8)}`,
    eventId: req.params.id,
    title: sanitizeString(title),
    category: sanitizeString(category) || 'General',
    milestone: sanitizeString(milestone) || 'Preparation',
    dueDate: dueDate || event.eventDate,
    priority: sanitizeString(priority) || 'Medium',
    completed: false,
    assignedTo: sanitizeString(assignedTo) || 'Lead Planner',
    notes: sanitizeString(notes)
  };

  db.addTask(newTask);
  res.status(201).json({ message: 'Task created', task: newTask });
});

router.put('/:id/tasks/:taskId', (req, res) => {
  const updated = db.updateTask(req.params.taskId, req.body);
  if (!updated) return res.status(404).json({ message: 'Task not found' });
  res.json({ message: 'Task updated', task: updated });
});

router.delete('/:id/tasks/:taskId', (req, res) => {
  const success = db.deleteTask(req.params.taskId);
  if (!success) return res.status(404).json({ message: 'Task not found' });
  res.json({ message: 'Task deleted' });
});

// ---------------- VENDORS ----------------

router.get('/:id/vendors', (req, res) => {
  const event = db.getEventById(req.params.id, req.user.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json({ vendors: db.getVendors(req.params.id) });
});

router.post('/:id/vendors', (req, res) => {
  const event = db.getEventById(req.params.id, req.user.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  const { name, category, contactPerson, phone, email, quotedPrice, agreedPrice = 0, paymentStatus = 'Unpaid', bookingStatus = 'Inquiry', services = '', notes = '', rating = 4.5 } = req.body;
  if (!name || !category) {
    return res.status(400).json({ message: 'Vendor name and category are required.' });
  }

  const newVendor = {
    id: `ven-${uuidv4().slice(0, 8)}`,
    eventId: req.params.id,
    name: sanitizeString(name),
    category: sanitizeString(category),
    contactPerson: sanitizeString(contactPerson),
    phone: sanitizeString(phone),
    email: sanitizeString(email),
    quotedPrice: validatePositiveNumber(quotedPrice, 0),
    agreedPrice: validatePositiveNumber(agreedPrice, 0),
    paymentStatus: sanitizeString(paymentStatus) || 'Unpaid',
    bookingStatus: sanitizeString(bookingStatus) || 'Inquiry',
    rating: validatePositiveNumber(rating, 4.5),
    services: sanitizeString(services),
    notes: sanitizeString(notes),
    isSample: false
  };

  db.addVendor(newVendor);
  res.status(201).json({ message: 'Vendor added', vendor: newVendor });
});

router.put('/:id/vendors/:venId', (req, res) => {
  const updated = db.updateVendor(req.params.venId, req.body);
  if (!updated) return res.status(404).json({ message: 'Vendor not found' });
  res.json({ message: 'Vendor updated', vendor: updated });
});

router.delete('/:id/vendors/:venId', (req, res) => {
  const success = db.deleteVendor(req.params.venId);
  if (!success) return res.status(404).json({ message: 'Vendor not found' });
  res.json({ message: 'Vendor removed' });
});

// ---------------- SAVED IDEAS ----------------

router.get('/:id/ideas', (req, res) => {
  res.json({ ideas: db.getIdeas(req.params.id) });
});

router.post('/:id/ideas', (req, res) => {
  const { title, category, description, budgetImpact, practicalTip } = req.body;
  const newIdea = {
    id: `idea-${uuidv4().slice(0, 8)}`,
    eventId: req.params.id,
    title,
    category,
    description,
    budgetImpact,
    practicalTip,
    savedAt: new Date().toISOString()
  };
  db.addIdea(newIdea);
  res.status(201).json({ message: 'Idea saved to event', idea: newIdea });
});

router.delete('/:id/ideas/:ideaId', (req, res) => {
  const success = db.deleteIdea(req.params.ideaId);
  if (!success) return res.status(404).json({ message: 'Idea not found' });
  res.json({ message: 'Idea removed' });
});

export default router;
