import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import confetti from 'canvas-confetti';

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [events, setEvents] = useState([]);
  const [currentEventId, setCurrentEventId] = useState(() => localStorage.getItem('eventease_active_event_id'));
  const [currentEventData, setCurrentEventData] = useState(null); // { event, tasks, expenses, vendors, savedIdeas }
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' | 'info' }

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 4000);
  }, []);

  // Fetch all user events
  const refreshEvents = useCallback(async (selectIdAfter = null) => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const res = await api.getEvents();
      const list = res.events || [];
      setEvents(list);

      let targetId = selectIdAfter || currentEventId;
      if (!targetId || !list.some(e => e.id === targetId)) {
        targetId = list[0]?.id || null;
      }

      if (targetId) {
        setCurrentEventId(targetId);
        localStorage.setItem('eventease_active_event_id', targetId);
      } else {
        setCurrentEventId(null);
        setCurrentEventData(null);
        localStorage.removeItem('eventease_active_event_id');
      }
    } catch (err) {
      console.error('Failed fetching events:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, currentEventId]);

  // Fetch full details of the active event
  const refreshCurrentEvent = useCallback(async () => {
    if (!currentEventId || !isAuthenticated) {
      setCurrentEventData(null);
      return;
    }
    try {
      const res = await api.getEvent(currentEventId);
      setCurrentEventData(res);
    } catch (err) {
      console.error('Failed fetching active event details:', err);
      showToast('Could not load event details.', 'error');
    }
  }, [currentEventId, isAuthenticated, showToast]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshEvents();
    } else {
      setEvents([]);
      setCurrentEventData(null);
      setCurrentEventId(null);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (currentEventId && isAuthenticated) {
      refreshCurrentEvent();
    }
  }, [currentEventId, isAuthenticated]);

  const selectEvent = (id) => {
    setCurrentEventId(id);
    localStorage.setItem('eventease_active_event_id', id);
  };

  // Event CRUD
  const createEvent = async (eventPayload) => {
    try {
      setAiGenerating(true);
      const res = await api.createEvent(eventPayload);
      showToast(`🎉 "${res.event.name}" created with custom AI plan!`, 'success');
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      await refreshEvents(res.event.id);
      return res.event;
    } catch (err) {
      showToast(err.message || 'Failed to create event', 'error');
      throw err;
    } finally {
      setAiGenerating(false);
    }
  };

  const updateCurrentEvent = async (updates) => {
    if (!currentEventId) return;
    try {
      const res = await api.updateEvent(currentEventId, updates);
      showToast('Event settings saved', 'success');
      await refreshCurrentEvent();
      await refreshEvents();
      return res.event;
    } catch (err) {
      showToast(err.message || 'Failed to update event', 'error');
      throw err;
    }
  };

  const deleteCurrentEvent = async (eventIdToDelete = currentEventId) => {
    if (!eventIdToDelete) return;
    try {
      await api.deleteEvent(eventIdToDelete);
      showToast('Event removed', 'info');
      await refreshEvents();
    } catch (err) {
      showToast(err.message || 'Failed to delete event', 'error');
      throw err;
    }
  };

  // Regenerate AI Plan
  const regeneratePlan = async () => {
    if (!currentEventData?.event) return;
    try {
      setAiGenerating(true);
      const res = await api.generatePlan(currentEventData.event.id, currentEventData.event);
      showToast('✨ Gemini AI refreshed your event plan!', 'success');
      confetti({ particleCount: 50, spread: 70 });
      await refreshCurrentEvent();
      return res.plan;
    } catch (err) {
      showToast('Failed to regenerate AI plan: ' + err.message, 'error');
    } finally {
      setAiGenerating(false);
    }
  };

  // Expense Management
  const addExpense = async (expenseData) => {
    if (!currentEventId) return;
    try {
      await api.addExpense(currentEventId, expenseData);
      showToast('Expense recorded', 'success');
      await refreshCurrentEvent();
    } catch (err) {
      showToast(err.message || 'Failed to add expense', 'error');
    }
  };

  const updateExpense = async (expId, updates) => {
    if (!currentEventId) return;
    try {
      await api.updateExpense(currentEventId, expId, updates);
      showToast('Expense updated', 'success');
      await refreshCurrentEvent();
    } catch (err) {
      showToast(err.message || 'Failed to update expense', 'error');
    }
  };

  const deleteExpense = async (expId) => {
    if (!currentEventId) return;
    try {
      await api.deleteExpense(currentEventId, expId);
      showToast('Expense deleted', 'info');
      await refreshCurrentEvent();
    } catch (err) {
      showToast(err.message || 'Failed to delete expense', 'error');
    }
  };

  // Task Management
  const addTask = async (taskData) => {
    if (!currentEventId) return;
    try {
      await api.addTask(currentEventId, taskData);
      showToast('New task added', 'success');
      await refreshCurrentEvent();
    } catch (err) {
      showToast(err.message || 'Failed to add task', 'error');
    }
  };

  const updateTask = async (taskId, updates) => {
    if (!currentEventId) return;
    try {
      await api.updateTask(currentEventId, taskId, updates);
      if (updates.completed) {
        confetti({ particleCount: 35, spread: 45, origin: { y: 0.7 } });
        showToast('Milestone achieved! 🎯', 'success');
      }
      await refreshCurrentEvent();
    } catch (err) {
      showToast(err.message || 'Failed to update task', 'error');
    }
  };

  const deleteTask = async (taskId) => {
    if (!currentEventId) return;
    try {
      await api.deleteTask(currentEventId, taskId);
      showToast('Task removed', 'info');
      await refreshCurrentEvent();
    } catch (err) {
      showToast(err.message || 'Failed to delete task', 'error');
    }
  };

  // Vendor Management
  const addVendor = async (vendorData) => {
    if (!currentEventId) return;
    try {
      await api.addVendor(currentEventId, vendorData);
      showToast('Vendor added to directory', 'success');
      await refreshCurrentEvent();
    } catch (err) {
      showToast(err.message || 'Failed to add vendor', 'error');
    }
  };

  const updateVendor = async (vendorId, updates) => {
    if (!currentEventId) return;
    try {
      await api.updateVendor(currentEventId, vendorId, updates);
      showToast('Vendor details updated', 'success');
      await refreshCurrentEvent();
    } catch (err) {
      showToast(err.message || 'Failed to update vendor', 'error');
    }
  };

  const deleteVendor = async (vendorId) => {
    if (!currentEventId) return;
    try {
      await api.deleteVendor(currentEventId, vendorId);
      showToast('Vendor removed', 'info');
      await refreshCurrentEvent();
    } catch (err) {
      showToast(err.message || 'Failed to delete vendor', 'error');
    }
  };

  // Saved Ideas
  const saveIdea = async (ideaData) => {
    if (!currentEventId) {
      showToast('Please select or create an event first to bookmark ideas.', 'info');
      return;
    }
    try {
      await api.saveIdea(currentEventId, ideaData);
      showToast('Idea pinned to event!', 'success');
      await refreshCurrentEvent();
    } catch (err) {
      showToast(err.message || 'Failed to save idea', 'error');
    }
  };

  const deleteIdea = async (ideaId) => {
    if (!currentEventId) return;
    try {
      await api.deleteIdea(currentEventId, ideaId);
      showToast('Idea removed from bookmarks', 'info');
      await refreshCurrentEvent();
    } catch (err) {
      showToast(err.message || 'Failed to remove idea', 'error');
    }
  };

  // Live Calculated Metrics
  const metrics = useMemo(() => {
    if (!currentEventData?.event) {
      return {
        totalBudget: 0,
        estimatedTotal: 0,
        actualTotal: 0,
        totalSpent: 0,
        remainingBudget: 0,
        budgetUsedPercent: 0,
        isOverBudget: false,
        totalTasks: 0,
        completedTasks: 0,
        taskProgress: 0,
        daysLeft: 0,
        totalVendors: 0,
        bookedVendors: 0
      };
    }

    const event = currentEventData.event;
    const expenses = currentEventData.expenses || [];
    const tasks = currentEventData.tasks || [];
    const vendors = currentEventData.vendors || [];

    const totalBudget = Number(event.totalBudget) || 0;
    const estimatedTotal = expenses.reduce((s, e) => s + (Number(e.estimatedAmount) || 0), 0);
    const actualTotal = expenses.reduce((s, e) => s + (Number(e.actualAmount) || 0), 0);
    
    // Total spent is actual amounts if non-zero, else estimated amounts
    const totalSpent = expenses.reduce((s, e) => {
      const val = (Number(e.actualAmount) > 0) ? Number(e.actualAmount) : (Number(e.estimatedAmount) || 0);
      return s + val;
    }, 0);

    const remainingBudget = totalBudget - totalSpent;
    const budgetUsedPercent = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;
    const isOverBudget = remainingBudget < 0;

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const eventDate = new Date(event.eventDate);
    const today = new Date();
    const daysLeft = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));

    const totalVendors = vendors.length;
    const bookedVendors = vendors.filter(v => v.bookingStatus === 'Booked').length;

    return {
      totalBudget,
      estimatedTotal,
      actualTotal,
      totalSpent,
      remainingBudget,
      budgetUsedPercent,
      isOverBudget,
      totalTasks,
      completedTasks,
      taskProgress,
      daysLeft,
      totalVendors,
      bookedVendors
    };
  }, [currentEventData]);

  return (
    <EventContext.Provider value={{
      events,
      currentEvent: currentEventData?.event || null,
      currentEventData,
      currentEventId,
      tasks: currentEventData?.tasks || [],
      expenses: currentEventData?.expenses || [],
      vendors: currentEventData?.vendors || [],
      savedIdeas: currentEventData?.savedIdeas || [],
      metrics,
      loading,
      aiGenerating,
      toast,
      showToast,
      selectEvent,
      refreshEvents,
      refreshCurrentEvent,
      createEvent,
      updateCurrentEvent,
      deleteCurrentEvent,
      regeneratePlan,
      addExpense,
      updateExpense,
      deleteExpense,
      addTask,
      updateTask,
      deleteTask,
      addVendor,
      updateVendor,
      deleteVendor,
      saveIdea,
      deleteIdea
    }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => useContext(EventContext);
