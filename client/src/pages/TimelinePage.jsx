import React, { useState } from 'react';
import { useEvents } from '../context/EventContext';
import TiltCard from '../components/TiltCard';
import {
  Calendar,
  CheckSquare,
  Plus,
  Clock,
  Filter,
  Trash2,
  Edit2,
  X,
  Sparkles,
  ChevronRight,
  ListFilter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const MILESTONES = [
  'Initial planning and budgeting',
  'Venue selection and booking',
  'Vendor research and confirmation',
  'Guest list preparation',
  'Invitations and RSVPs',
  'Catering and decoration finalization',
  'Event-day schedule',
  'Post-event activities'
];

export default function TimelinePage({ setActivePage }) {
  const { currentEvent, tasks, addTask, updateTask, deleteTask } = useEvents();

  const [viewMode, setViewMode] = useState('milestones'); // 'milestones' | 'checklist'
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All'); // 'All' | 'Pending' | 'Completed'

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [title, setTitle] = useState('');
  const [milestone, setMilestone] = useState(MILESTONES[0]);
  const [category, setCategory] = useState('General');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [notes, setNotes] = useState('');

  if (!currentEvent) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">No Event Selected</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Please choose an event to manage its schedule and milestones.</p>
        <button
          onClick={() => setActivePage('create-event')}
          className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
        >
          Create Event
        </button>
      </div>
    );
  }

  const openAddModal = () => {
    setEditingTask(null);
    setTitle('');
    setMilestone(MILESTONES[0]);
    setCategory('General');
    setDueDate(currentEvent.eventDate);
    setPriority('Medium');
    setAssignedTo('');
    setNotes('');
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setMilestone(task.milestone || MILESTONES[0]);
    setCategory(task.category || 'General');
    setDueDate(task.dueDate || currentEvent.eventDate);
    setPriority(task.priority || 'Medium');
    setAssignedTo(task.assignedTo || '');
    setNotes(task.notes || '');
    setModalOpen(true);
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    if (!title) return;

    const payload = {
      title,
      milestone,
      category,
      dueDate,
      priority,
      assignedTo,
      notes
    };

    if (editingTask) {
      await updateTask(editingTask.id, payload);
    } else {
      await addTask(payload);
    }
    setModalOpen(false);
  };

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    if (filterPriority !== 'All' && t.priority !== filterPriority) return false;
    if (filterStatus === 'Pending' && t.completed) return false;
    if (filterStatus === 'Completed' && !t.completed) return false;
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  // Group tasks by milestone
  const milestoneGroups = MILESTONES.map(m => ({
    name: m,
    tasks: filteredTasks.filter(t => t.milestone === m)
  })).filter(g => g.tasks.length > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5" /> Preparation Roadmap
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Timeline & Task Manager
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Keep every milestone on track leading up to {currentEvent.eventDate}.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all hover:scale-105 flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Action Item
        </button>
      </div>

      {/* Progress & Milestone Overview */}
      <TiltCard className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Readiness Score
            </span>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {progressPercent}%
              </span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                ({completedCount} of {tasks.length} items checked off)
              </span>
            </div>
          </div>

          {/* View Toggles & Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('milestones')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  viewMode === 'milestones' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Milestone View
              </button>
              <button
                onClick={() => setViewMode('checklist')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  viewMode === 'checklist' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Checklist View
              </button>
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending Only</option>
              <option value="Completed">Completed Only</option>
            </select>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full mt-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </TiltCard>

      {/* Task List Rendering */}
      {viewMode === 'milestones' ? (
        /* Milestone Grouped View */
        <div className="space-y-6">
          {milestoneGroups.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              No tasks match the active filters.
            </div>
          ) : (
            milestoneGroups.map((group, gIdx) => (
              <div
                key={gIdx}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-500/10 text-purple-600 font-extrabold text-xs flex items-center justify-center">
                      {gIdx + 1}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {group.name}
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    {group.tasks.filter(t => t.completed).length} / {group.tasks.length} Done
                  </span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {group.tasks.map(t => (
                    <div key={t.id} className="py-3 flex items-start justify-between gap-3 group">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={t.completed}
                          onChange={(e) => updateTask(t.id, { completed: e.target.checked })}
                          aria-label={`Mark task "${t.title}" as ${t.completed ? 'incomplete' : 'complete'}`}
                          className="mt-1 w-4 h-4 accent-purple-600 rounded focus-visible:ring-2 focus-visible:ring-purple-500 cursor-pointer"
                        />
                        <div>
                          <p className={`text-xs font-semibold transition-all ${
                            t.completed
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-900 dark:text-white group-hover:text-purple-600'
                          }`}>
                            {t.title}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-600 dark:text-slate-400" aria-hidden="true" /> Due: {t.dueDate}
                            </span>
                            {t.assignedTo && (
                              <span>• Assigned: {t.assignedTo}</span>
                            )}
                            {t.notes && (
                              <span>• {t.notes}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          t.priority === 'High'
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                            : (t.priority === 'Medium' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400')
                        }`}>
                          {t.priority}
                        </span>
                        <button
                          onClick={() => openEditModal(t)}
                          aria-label={`Edit task: ${t.title}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none transition-colors"
                          title="Edit Task"
                        >
                          <Edit2 className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => deleteTask(t.id)}
                          aria-label={`Delete task: ${t.title}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none transition-colors"
                          title="Delete Task"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Flat Checklist View */
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredTasks.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-600 dark:text-slate-400">
                No tasks match current filter.
              </div>
            ) : (
              filteredTasks.map(t => (
                <div key={t.id} className="py-3 flex items-start justify-between gap-3 group">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={t.completed}
                      onChange={(e) => updateTask(t.id, { completed: e.target.checked })}
                      className="mt-1 w-4 h-4 accent-purple-600 rounded cursor-pointer"
                    />
                    <div>
                      <p className={`text-xs font-semibold ${
                        t.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white group-hover:text-purple-600'
                      }`}>
                        {t.title}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                        <span className="font-semibold text-purple-600 dark:text-purple-400">{t.milestone}</span>
                        <span>•</span>
                        <span>Due: {t.dueDate}</span>
                        {t.assignedTo && <span>• {t.assignedTo}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      t.priority === 'High' ? 'bg-rose-500/10 text-rose-600' : (t.priority === 'Medium' ? 'bg-amber-500/10 text-amber-600' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400')
                    }`}>
                      {t.priority}
                    </span>
                    <button
                      onClick={() => openEditModal(t)}
                      className="p-1 text-slate-400 hover:text-purple-600 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteTask(t.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add / Edit Task Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {editingTask ? 'Edit Action Item' : 'Create New Preparation Task'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Confirm 2nd round sound check with DJ"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Milestone Phase *
                  </label>
                  <select
                    value={milestone}
                    onChange={(e) => setMilestone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  >
                    {MILESTONES.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Assigned To
                  </label>
                  <input
                    type="text"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    placeholder="e.g. Lead Planner / Maid of Honor"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Notes / Briefing
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional context or contact numbers for this task"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-500/20"
                >
                  {editingTask ? 'Save Task' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
