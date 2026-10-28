import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import TiltCard from '../components/TiltCard';
import {
  Sparkles,
  Calendar,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Plus,
  Users,
  Lightbulb,
  PartyPopper,
  ShieldCheck,
  CheckSquare,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function DashboardPage({ setActivePage }) {
  const { user, isDemo } = useAuth();
  const {
    events,
    currentEvent,
    metrics,
    tasks,
    expenses,
    vendors,
    updateTask,
    selectEvent
  } = useEvents();

  if (!currentEvent && events.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-purple-500/10 text-purple-600 flex items-center justify-center animate-bounce-short">
          <Sparkles className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Welcome to EventEase AI, {user?.name || 'Planner'}!
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          You haven't created any events yet. Get started by designing your first wedding, birthday, or community celebration with Gemini AI intelligence.
        </p>
        <button
          onClick={() => setActivePage('create-event')}
          className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-xl shadow-purple-500/25 transition-all hover:scale-105 inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Your First Event
        </button>
      </div>
    );
  }

  // Next upcoming tasks
  const pendingTasks = tasks.filter(t => !t.completed).slice(0, 4);

  // Grouped expenses by category for quick chart
  const categorySpending = expenses.slice(0, 5).map(e => ({
    name: e.category.split(' ')[0],
    amount: Number(e.actualAmount) || Number(e.estimatedAmount) || 0
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-900/10 via-indigo-900/10 to-pink-900/10 border border-purple-500/20 backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Active Celebration Workspace
            </span>
            {isDemo && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                Demo Mode
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>{currentEvent?.name}</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-600 text-white font-bold uppercase tracking-wide">
              {currentEvent?.eventType}
            </span>
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-purple-500" /> {currentEvent?.eventDate}</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-purple-500" /> {currentEvent?.location}</span>
            <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-purple-500" /> {currentEvent?.guestCount} Guests</span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActivePage('plan')}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> View AI Plan
          </button>
          <button
            onClick={() => setActivePage('create-event')}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> New Event
          </button>
        </div>
      </div>

      {/* KPI Stats in 3D Tilt Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Planned Budget */}
        <TiltCard className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Total Budget</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            ₹{metrics.totalBudget.toLocaleString('en-IN')}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400">Spent: ₹{metrics.totalSpent.toLocaleString('en-IN')}</span>
            <span className={`font-bold ${metrics.isOverBudget ? 'text-rose-500' : 'text-emerald-500'}`}>
              {metrics.budgetUsedPercent}% used
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${metrics.isOverBudget ? 'bg-rose-500' : 'bg-purple-600'}`}
              style={{ width: `${Math.min(100, metrics.budgetUsedPercent)}%` }}
            />
          </div>
        </TiltCard>

        {/* Remaining Cushion */}
        <TiltCard className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Remaining Balance</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${metrics.isOverBudget ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-600'}`}>
              {metrics.isOverBudget ? <AlertTriangle className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
            </div>
          </div>
          <div className={`text-2xl font-extrabold ${metrics.isOverBudget ? 'text-rose-600' : 'text-emerald-600 dark:text-emerald-400'}`}>
            ₹{Math.abs(metrics.remainingBudget).toLocaleString('en-IN')}
          </div>
          <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">
            {metrics.isOverBudget ? '⚠️ Budget limit exceeded! Check AI savings.' : 'Cushion available for unexpected additions.'}
          </p>
        </TiltCard>

        {/* Task Completion Progress */}
        <TiltCard className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Preparation Progress</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {metrics.taskProgress}%
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>{metrics.completedTasks} completed</span>
            <span>{metrics.totalTasks - metrics.completedTasks} remaining</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
              style={{ width: `${metrics.taskProgress}%` }}
            />
          </div>
        </TiltCard>

        {/* Days Left Countdown */}
        <TiltCard className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Days to Celebration</span>
            <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {metrics.daysLeft > 0 ? `${metrics.daysLeft} Days` : (metrics.daysLeft === 0 ? 'Today! 🎊' : 'Concluded')}
          </div>
          <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-purple-500" />
            Date: {currentEvent?.eventDate}
          </p>
        </TiltCard>
      </div>

      {/* Main Grid: Upcoming Tasks & Budget Breakdown preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Urgent Checklist & Theme banner */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Tasks Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-purple-600" />
                  Upcoming Timeline Deadlines
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">Click checkboxes to mark tasks completed</p>
              </div>
              <button
                onClick={() => setActivePage('timeline')}
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
              >
                All Tasks ({tasks.length}) <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 pt-2">
              {pendingTasks.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-600 dark:text-slate-400">
                  🎉 Fantastic! All upcoming tasks for this event are marked complete.
                </div>
              ) : (
                pendingTasks.map(t => (
                  <div key={t.id} className="py-3 flex items-start justify-between gap-3 group">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={t.completed}
                        onChange={(e) => updateTask(t.id, { completed: e.target.checked })}
                        className="mt-1 w-4 h-4 accent-purple-600 rounded cursor-pointer"
                      />
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                          {t.title}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                          <span className="font-medium">{t.milestone}</span>
                          <span>•</span>
                          <span>Due: {t.dueDate}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                      t.priority === 'High'
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        : (t.priority === 'Medium' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400')
                    }`}>
                      {t.priority}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* AI Theme & Highlight Card */}
          {currentEvent?.aiPlan?.theme && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/10 via-indigo-900/10 to-transparent border border-purple-500/20 backdrop-blur-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> AI Recommended Aesthetic
                </span>
                <button
                  onClick={() => setActivePage('plan')}
                  className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Full AI Dossier
                </button>
              </div>

              <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {currentEvent.aiPlan.theme.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentEvent.aiPlan.theme.description}
              </p>

              {/* Color swatches */}
              {currentEvent.aiPlan.theme.colorPalette && (
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Palette:</span>
                  <div className="flex items-center gap-2">
                    {currentEvent.aiPlan.theme.colorPalette.map((col, idx) => (
                      <div
                        key={idx}
                        className="w-6 h-6 rounded-full border border-white/50 shadow-md transform hover:scale-110 transition-transform"
                        style={{ backgroundColor: col }}
                        title={col}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Spending distribution & Quick Nav */}
        <div className="space-y-6">
          {/* Spending Mini Chart */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-purple-600" />
                Category Allocations
              </h3>
              <button
                onClick={() => setActivePage('budget')}
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
              >
                Budget Dashboard
              </button>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categorySpending}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                    contentStyle={{ borderRadius: '0.75rem', fontSize: '11px' }}
                  />
                  <Bar dataKey="amount" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Vendors & Ideas Quick Links */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setActivePage('vendors')}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/40 text-left transition-all shadow-sm hover:shadow-md group"
            >
              <Users className="w-5 h-5 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-xs text-slate-900 dark:text-white">Vendors</div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">{vendors.length} active partners</p>
            </button>

            <button
              onClick={() => setActivePage('ideas')}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/40 text-left transition-all shadow-sm hover:shadow-md group"
            >
              <Lightbulb className="w-5 h-5 text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-xs text-slate-900 dark:text-white">AI Ideas</div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">Themes, return gifts & games</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
