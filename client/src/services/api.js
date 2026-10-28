const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('eventease_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const err = new Error(data.message || `Request failed with status ${res.status}`);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err);
    throw err;
  }
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  demoLogin: () => request('/auth/demo', { method: 'POST' }),
  getMe: () => request('/auth/me'),
  updateProfile: (profile) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(profile) }),

  // Events
  getEvents: () => request('/events'),
  getEvent: (id) => request(`/events/${id}`),
  createEvent: (eventData) => request('/events', { method: 'POST', body: JSON.stringify(eventData) }),
  updateEvent: (id, updates) => request(`/events/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  deleteEvent: (id) => request(`/events/${id}`, { method: 'DELETE' }),

  // Expenses
  getExpenses: (eventId) => request(`/events/${eventId}/expenses`),
  addExpense: (eventId, expense) => request(`/events/${eventId}/expenses`, { method: 'POST', body: JSON.stringify(expense) }),
  updateExpense: (eventId, expId, updates) => request(`/events/${eventId}/expenses/${expId}`, { method: 'PUT', body: JSON.stringify(updates) }),
  deleteExpense: (eventId, expId) => request(`/events/${eventId}/expenses/${expId}`, { method: 'DELETE' }),

  // Tasks
  getTasks: (eventId) => request(`/events/${eventId}/tasks`),
  addTask: (eventId, task) => request(`/events/${eventId}/tasks`, { method: 'POST', body: JSON.stringify(task) }),
  updateTask: (eventId, taskId, updates) => request(`/events/${eventId}/tasks/${taskId}`, { method: 'PUT', body: JSON.stringify(updates) }),
  deleteTask: (eventId, taskId) => request(`/events/${eventId}/tasks/${taskId}`, { method: 'DELETE' }),

  // Vendors
  getVendors: (eventId) => request(`/events/${eventId}/vendors`),
  addVendor: (eventId, vendor) => request(`/events/${eventId}/vendors`, { method: 'POST', body: JSON.stringify(vendor) }),
  updateVendor: (eventId, vendorId, updates) => request(`/events/${eventId}/vendors/${vendorId}`, { method: 'PUT', body: JSON.stringify(updates) }),
  deleteVendor: (eventId, vendorId) => request(`/events/${eventId}/vendors/${vendorId}`, { method: 'DELETE' }),

  // Ideas
  getIdeas: (eventId) => request(`/events/${eventId}/ideas`),
  saveIdea: (eventId, idea) => request(`/events/${eventId}/ideas`, { method: 'POST', body: JSON.stringify(idea) }),
  deleteIdea: (eventId, ideaId) => request(`/events/${eventId}/ideas/${ideaId}`, { method: 'DELETE' }),

  // AI Generation
  generatePlan: (eventId, eventData) => request('/ai/generate-plan', { method: 'POST', body: JSON.stringify({ eventId, eventData }) }),
  generateIdeas: (params) => request('/ai/generate-ideas', { method: 'POST', body: JSON.stringify(params) }),
  getCostSavings: (eventId, totalBudget) => request('/ai/cost-savings', { method: 'POST', body: JSON.stringify({ eventId, totalBudget }) }),

  // Health
  checkHealth: () => request('/health')
};
