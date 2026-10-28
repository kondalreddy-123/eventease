import React, { useState, useEffect } from 'react';
import { useEvents } from '../context/EventContext';
import { api } from '../services/api';
import TiltCard from '../components/TiltCard';
import {
  DollarSign,
  Plus,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  PieChart as PieIcon,
  BarChart3,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

const EXPENSE_CATEGORIES = [
  'Venue and booking',
  'Food and catering',
  'Decoration and flowers',
  'Photography and videography',
  'Entertainment',
  'Invitations and gifts',
  'Transportation and accommodation',
  'Miscellaneous expenses',
  'Emergency contingency fund'
];

const COLORS = [
  '#8b5cf6', // purple
  '#6366f1', // indigo
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#38bdf8', // sky
  '#f97316', // orange
  '#64748b', // slate
  '#14b8a6'  // teal
];

export default function BudgetPage({ setActivePage }) {
  const {
    currentEvent,
    expenses,
    metrics,
    addExpense,
    updateExpense,
    deleteExpense
  } = useEvents();

  // Modals & form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [estimatedAmount, setEstimatedAmount] = useState('');
  const [actualAmount, setActualAmount] = useState('');
  const [status, setStatus] = useState('Unpaid');
  const [notes, setNotes] = useState('');

  // AI Savings state
  const [savingsData, setSavingsData] = useState(null);
  const [savingsLoading, setSavingsLoading] = useState(false);

  useEffect(() => {
    async function loadSavings() {
      if (!currentEvent) return;
      try {
        setSavingsLoading(true);
        const res = await api.getCostSavings(currentEvent.id, currentEvent.totalBudget);
        setSavingsData(res);
      } catch (err) {
        console.warn('Could not load AI savings:', err);
      } finally {
        setSavingsLoading(false);
      }
    }
    loadSavings();
  }, [currentEvent, expenses]);

  if (!currentEvent) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">No Event Selected</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Please select an event to manage its budget.</p>
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
    setEditingExpense(null);
    setTitle('');
    setCategory(EXPENSE_CATEGORIES[0]);
    setEstimatedAmount('');
    setActualAmount('');
    setStatus('Unpaid');
    setNotes('');
    setModalOpen(true);
  };

  const openEditModal = (exp) => {
    setEditingExpense(exp);
    setTitle(exp.title);
    setCategory(exp.category);
    setEstimatedAmount(exp.estimatedAmount);
    setActualAmount(exp.actualAmount);
    setStatus(exp.status || 'Unpaid');
    setNotes(exp.notes || '');
    setModalOpen(true);
  };

  const handleSaveExpense = async (e) => {
    e.preventDefault();
    if (!title) return;

    const payload = {
      title,
      category,
      estimatedAmount: Number(estimatedAmount) || 0,
      actualAmount: Number(actualAmount) || 0,
      status,
      notes
    };

    if (editingExpense) {
      await updateExpense(editingExpense.id, payload);
    } else {
      await addExpense(payload);
    }
    setModalOpen(false);
  };

  // Grouped category data for Pie Chart
  const categoryMap = {};
  expenses.forEach(e => {
    const cat = e.category || 'Other';
    const val = Number(e.actualAmount) > 0 ? Number(e.actualAmount) : (Number(e.estimatedAmount) || 0);
    categoryMap[cat] = (categoryMap[cat] || 0) + val;
  });

  const pieData = Object.keys(categoryMap).map(cat => ({
    name: cat,
    value: categoryMap[cat]
  })).filter(d => d.value > 0);

  // Category comparison data for Bar Chart
  const barDataMap = {};
  expenses.forEach(e => {
    const cat = e.category.split(' ')[0];
    if (!barDataMap[cat]) {
      barDataMap[cat] = { category: cat, estimated: 0, actual: 0 };
    }
    barDataMap[cat].estimated += Number(e.estimatedAmount) || 0;
    barDataMap[cat].actual += Number(e.actualAmount) || 0;
  });
  const barData = Object.values(barDataMap);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5" /> Smart Financial Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Budget & Expense Manager
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Track allocations, monitor estimated vs actual spends, and receive AI cost-saving alternatives.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all hover:scale-105 flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Record New Expense
        </button>
      </div>

      {/* Budget Limit Warning Banner */}
      {metrics.isOverBudget && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-200 flex items-start gap-3 text-xs animate-pulse">
          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-sm">
              Warning: Planned Budget Exceeded by ₹{Math.abs(metrics.remainingBudget).toLocaleString('en-IN')}!
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              Total committed expenses (₹{metrics.totalSpent.toLocaleString('en-IN')}) exceed your target cap of ₹{metrics.totalBudget.toLocaleString('en-IN')}. Please examine the AI cost-saving suggestions below to adjust vendor packages or menus.
            </p>
          </div>
        </div>
      )}

      {/* KPI Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <TiltCard className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Total Planned Cap</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            ₹{metrics.totalBudget.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2">Target allocation limit</p>
        </TiltCard>

        <TiltCard className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Total Estimated</span>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
            ₹{metrics.estimatedTotal.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2">Sum of category quotes</p>
        </TiltCard>

        <TiltCard className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Actual Outflow</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            ₹{metrics.actualTotal.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2">Confirmed disbursements</p>
        </TiltCard>

        <TiltCard className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Remaining Cushion</span>
          <div className={`text-2xl font-black mt-1 ${metrics.isOverBudget ? 'text-rose-500' : 'text-emerald-500'}`}>
            ₹{Math.abs(metrics.remainingBudget).toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2">{metrics.budgetUsedPercent}% utilized</p>
        </TiltCard>
      </div>

      {/* Visual Analytics: Category Pie Chart & Comparison Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown Donut */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-purple-600" />
              Category Allocation Share
            </h3>
            <span className="text-xs text-slate-600 dark:text-slate-400">Current Distribution</span>
          </div>

          <div className="h-64 w-full">
            {pieData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-600 dark:text-slate-400">
                No expense data recorded yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                    contentStyle={{ borderRadius: '0.75rem', fontSize: '11px' }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Estimated vs Actual Bar Chart */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              Estimated vs. Actual Spending
            </h3>
            <span className="text-xs text-slate-600 dark:text-slate-400">Category Comparison</span>
          </div>

          <div className="h-64 w-full">
            {barData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-600 dark:text-slate-400">
                No expense data recorded yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="category" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                    contentStyle={{ borderRadius: '0.75rem', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                  <Bar dataKey="estimated" name="Estimated Quote" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="actual" name="Actual Paid" fill="#ec4899" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* AI Cost-Saving Recommendations Card */}
      {savingsData && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900/10 via-indigo-900/10 to-pink-900/10 border border-purple-500/30 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              <Sparkles className="w-4 h-4" /> Gemini AI Cost-Saving Insights
            </div>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Value Preservation Protocol
            </span>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
            {savingsData.summary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {savingsData.recommendations?.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-purple-500/20 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 dark:text-white truncate">{item.category}</span>
                  <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    Save ~₹{item.potentialSavings.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">{item.advice}</p>
                <div className="pt-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400 border-t border-slate-100 dark:border-slate-800">
                  ⚡ {item.action}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Expense Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Expense Log & Line Items ({expenses.length})
          </h3>
          <span className="text-[11px] text-slate-600 dark:text-slate-400">
            * All prices shown are user-entered or AI estimates and not binding vendor quotes.
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Expense Item</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Estimated</th>
                <th className="py-2.5 px-3">Actual</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Notes</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-600 dark:text-slate-400">
                    No expenses logged yet. Click "Record New Expense" above to add one.
                  </td>
                </tr>
              ) : (
                expenses.map(exp => (
                  <tr key={exp.id} className="hover:bg-purple-50/30 dark:hover:bg-purple-950/20 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                      {exp.title}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px]">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-purple-600 dark:text-purple-400">
                      ₹{Number(exp.estimatedAmount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                      ₹{Number(exp.actualAmount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                        exp.status === 'Paid'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : (exp.status === 'Partially Paid' ? 'bg-amber-500/10 text-amber-600' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400')
                      }`}>
                        {exp.status || 'Unpaid'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                      {exp.notes || '—'}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(exp)}
                        aria-label={`Edit expense item ${exp.title}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none transition-colors mr-1"
                        title="Edit Expense"
                      >
                        <Edit2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => deleteExpense(exp.id)}
                        aria-label={`Delete expense item ${exp.title}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none transition-colors"
                        title="Delete Expense"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Expense Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {editingExpense ? 'Edit Expense Record' : 'Record New Expense'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                aria-label="Close expense modal"
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none rounded-lg p-1"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Expense Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lawn Lighting & Fairy Canopy Deposit"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  >
                    {EXPENSE_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  >
                    <option value="Unpaid">Unpaid</option>
                    <option value="Partially Paid">Partially Paid</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Estimated Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={estimatedAmount}
                    onChange={(e) => setEstimatedAmount(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Actual Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={actualAmount}
                    onChange={(e) => setActualAmount(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Notes / Vendor Terms
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. 50% advance given on booking, balance on event day"
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
                  {editingExpense ? 'Save Changes' : 'Record Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
