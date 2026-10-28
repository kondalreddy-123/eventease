import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { api } from '../services/api';
import TiltCard from '../components/TiltCard';
import {
  Settings,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Palette,
  Utensils,
  Trash2,
  AlertTriangle,
  Save,
  Cpu,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export default function SettingsPage({ setActivePage }) {
  const { user, isDemo } = useAuth();
  const { currentEvent, updateCurrentEvent, deleteCurrentEvent, showToast } = useEvents();

  const [name, setName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [guestCount, setGuestCount] = useState(100);
  const [totalBudget, setTotalBudget] = useState(500000);
  const [theme, setTheme] = useState('');
  const [foodPreference, setFoodPreference] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [healthStatus, setHealthStatus] = useState(null);

  useEffect(() => {
    if (currentEvent) {
      setName(currentEvent.name || '');
      setEventDate(currentEvent.eventDate || '');
      setLocation(currentEvent.location || '');
      setGuestCount(currentEvent.guestCount || 100);
      setTotalBudget(currentEvent.totalBudget || 500000);
      setTheme(currentEvent.theme || '');
      setFoodPreference(currentEvent.foodPreference || '');
    }
  }, [currentEvent]);

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await api.checkHealth();
        setHealthStatus(res);
      } catch (e) {
        console.warn('Backend health check error:', e);
      }
    }
    checkHealth();
  }, []);

  if (!currentEvent) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">No Event Selected</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Please choose an event to manage settings.</p>
        <button
          onClick={() => setActivePage('create-event')}
          className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
        >
          Create Event
        </button>
      </div>
    );
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateCurrentEvent({
        name,
        eventDate,
        location,
        guestCount: Number(guestCount),
        totalBudget: Number(totalBudget),
        theme,
        foodPreference
      });
      showToast('Event settings successfully updated!', 'success');
    } catch (err) {
      showToast('Failed to update event: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCurrentEvent();
      setActivePage('dashboard');
    } catch (err) {
      showToast('Failed to delete event: ' + err.message, 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
          <Settings className="w-3.5 h-3.5" /> Event Configuration
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Event Settings & System Health
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Update event parameters, dates, guest counts, and view backend service status.
        </p>
      </div>

      {/* Main Form */}
      <TiltCard className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-6">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
          Event Details ({currentEvent.eventType})
        </h3>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Event Title *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Event Date *
              </label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Location *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Expected Guests
              </label>
              <input
                type="number"
                min="5"
                required
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Total Planned Budget (INR ₹)
              </label>
              <input
                type="number"
                min="10000"
                step="5000"
                required
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Theme / Decor Vibe
              </label>
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Food / Catering Notes
              </label>
              <input
                type="text"
                value={foodPreference}
                onChange={(e) => setFoodPreference(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </TiltCard>

      {/* System & AI Diagnostics Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Cpu className="w-4 h-4 text-purple-600" />
          System & AI Engine Diagnostics
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-600 dark:text-slate-400 block uppercase font-bold">Backend Service</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Healthy ({healthStatus?.version || '1.0.0'})
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-600 dark:text-slate-400 block uppercase font-bold">AI Planner Engine</span>
            <span className="font-extrabold text-purple-600 dark:text-purple-400 flex items-center gap-1.5 mt-1">
              <Sparkles className="w-3.5 h-3.5" />
              {healthStatus?.geminiLive ? 'Gemini 3.8 Flash (Live)' : 'EventEase Smart Engine (Active)'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-600 dark:text-slate-400 block uppercase font-bold">User Account Type</span>
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mt-1">
              {isDemo ? <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
              {isDemo ? 'Demo Evaluator' : (user?.role || 'Standard Planner')}
            </span>
          </div>
        </div>
      </div>

      {/* Danger Zone: Delete Event */}
      <div className="p-6 rounded-2xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20 shadow-md space-y-4">
        <h3 className="font-bold text-sm text-rose-600 dark:text-rose-400 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          Danger Zone
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Permanently delete "{currentEvent.name}" along with all its recorded expenses, timeline tasks, vendor quotes, and pinned AI ideas. This action cannot be reversed.
        </p>

        {!deleteConfirm ? (
          <button
            type="button"
            onClick={() => setDeleteConfirm(true)}
            className="px-4 py-2 rounded-xl border border-rose-500/30 text-rose-600 hover:bg-rose-500/10 font-bold text-xs flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete This Event
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/20"
            >
              Confirm Irreversible Deletion
            </button>
            <button
              type="button"
              onClick={() => setDeleteConfirm(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
