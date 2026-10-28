import React, { useState } from 'react';
import { useEvents } from '../context/EventContext';
import TiltCard from '../components/TiltCard';
import {
  Sparkles,
  Palette,
  Utensils,
  Music,
  Users,
  DollarSign,
  Calendar,
  AlertTriangle,
  RotateCw,
  Printer,
  Copy,
  Check,
  Building,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export default function EventPlanPage({ setActivePage }) {
  const { currentEvent, regeneratePlan, aiGenerating, showToast } = useEvents();
  const [copiedHex, setCopiedHex] = useState(null);

  if (!currentEvent) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">No Event Selected</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Please create or choose an event first to view its AI dossier.</p>
        <button
          onClick={() => setActivePage('create-event')}
          className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
        >
          Create Event
        </button>
      </div>
    );
  }

  const plan = currentEvent.aiPlan || {};
  const theme = plan.theme || {};
  const venueAndCatering = plan.venueAndCatering || {};
  const entertainment = plan.entertainment || [];
  const guestManagement = plan.guestManagement || [];
  const budgetBreakdown = plan.budgetBreakdown || [];
  const timeline = plan.timeline || [];
  const vendorChecklist = plan.vendorChecklist || [];
  const risks = plan.contingencyAndRisks || [];

  const copyToClipboard = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    showToast(`Copied ${hex} to clipboard!`, 'info');
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:p-0">
      {/* Top Banner and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Gemini 3.8 AI Event Dossier
            </span>
            {plan.isAiLive && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                Live AI Generated
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {currentEvent.name}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Tailored for {currentEvent.guestCount} guests in {currentEvent.location} • Budget: ₹{Number(currentEvent.totalBudget).toLocaleString('en-IN')}
          </p>
        </div>

        <div className="flex items-center gap-2.5 print:hidden">
          <button
            onClick={regeneratePlan}
            disabled={aiGenerating}
            aria-label={aiGenerating ? 'Regenerating AI event plan' : 'Regenerate event plan with Gemini AI'}
            aria-busy={aiGenerating}
            className="px-4 py-2 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center gap-2 transition-all hover:scale-102 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <RotateCw className={`w-3.5 h-3.5 ${aiGenerating ? 'animate-spin' : ''}`} aria-hidden="true" />
            <span>{aiGenerating ? 'Regenerating...' : 'Regenerate Plan'}</span>
          </button>

          <button
            onClick={handlePrint}
            aria-label="Print event plan or export as PDF"
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <Printer className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>

      {/* 1. Theme and Color Palette Banner */}
      <TiltCard className="p-6 sm:p-8 bg-gradient-to-br from-purple-900/15 via-indigo-900/10 to-pink-900/15 border border-purple-500/30 shadow-xl backdrop-blur-xl">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            <Palette className="w-4 h-4" aria-hidden="true" /> Recommended Visual Theme
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {theme.title || 'Festive Radiance'}
          </h2>
          {theme.tagline && (
            <p className="text-sm italic font-semibold text-purple-700 dark:text-purple-300">
              "{theme.tagline}"
            </p>
          )}
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-4xl">
            {theme.description}
          </p>

          {/* Color Swatches */}
          {theme.colorPalette && (
            <div className="pt-4 border-t border-purple-500/20">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide block mb-3">
                Curated Color Palette (Click swatch to copy hex code)
              </span>
              <div className="flex flex-wrap items-center gap-3">
                {theme.colorPalette.map((hex, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => copyToClipboard(hex)}
                    aria-label={`Copy color code ${hex} to clipboard`}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:scale-105 transition-transform group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                  >
                    <div
                      className="w-5 h-5 rounded-full border border-black/10 shadow-inner"
                      style={{ backgroundColor: hex }}
                      aria-hidden="true"
                    />
                    <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 group-hover:text-purple-600">
                      {hex}
                    </span>
                    {copiedHex === hex ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-600 dark:text-slate-400 group-hover:text-purple-600" aria-hidden="true" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </TiltCard>

      {/* 2-Column Grid: Venue/Catering & Entertainment/Guests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Venue & Catering Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            <Building className="w-4 h-4" /> Venue & Catering Logistics
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {venueAndCatering.venueAdvice}
          </p>

          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-purple-600" /> Menu Highlights
            </span>
            <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
              {(venueAndCatering.cateringHighlights || []).map((h, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Entertainment & Guest Hospitality */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <Music className="w-4 h-4" /> Entertainment & Activities
          </div>
          <ul className="text-xs space-y-2 text-slate-700 dark:text-slate-300 font-medium">
            {entertainment.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-600" /> Guest Hospitality Recommendations
            </span>
            <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
              {guestManagement.map((g, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Suggested Budget Allocation Breakdown */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            <DollarSign className="w-4 h-4" /> Suggested Budget Allocation (INR ₹)
          </div>
          <button
            onClick={() => setActivePage('budget')}
            aria-label="Open Budget Manager page"
            className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded"
          >
            Open Budget Manager <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs" aria-label="Suggested budget allocation breakdown table">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th scope="col" className="py-2.5 px-3">Expense Category</th>
                <th scope="col" className="py-2.5 px-3">Allocation</th>
                <th scope="col" className="py-2.5 px-3">%</th>
                <th scope="col" className="py-2.5 px-3">Reason / Context</th>
                <th scope="col" className="py-2.5 px-3">Cost-Saving Tip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {budgetBreakdown.map((item, idx) => (
                <tr key={idx} className="hover:bg-purple-50/40 dark:hover:bg-purple-950/20 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                    {item.category}
                  </td>
                  <td className="py-2.5 px-3 font-extrabold text-purple-600 dark:text-purple-400 whitespace-nowrap">
                    ₹{Number(item.allocatedAmount).toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-600 dark:text-slate-400">
                    {item.percentage}%
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                    {item.reason}
                  </td>
                  <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-medium">
                    💡 {item.savingTip}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Preparation Timeline Roadmap & Vendor Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Timeline Roadmap */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              <Calendar className="w-4 h-4" aria-hidden="true" /> Preparation Milestones
            </div>
            <button
              onClick={() => setActivePage('timeline')}
              aria-label="Open Timeline view"
              className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded"
            >
              Timeline View <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="space-y-4 pt-1">
            {timeline.map((step, idx) => (
              <div key={idx} className="relative pl-6 border-l-2 border-purple-500/40 space-y-1">
                <div className="absolute -left-1.5 top-0.5 w-3 h-3 rounded-full bg-purple-600 border-2 border-white dark:border-slate-900" />
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">{step.title}</span>
                  <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">{step.dueDate}</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">{step.milestone}</p>
                {step.tasks && (
                  <ul className="text-[11px] text-slate-500 space-y-0.5 pt-1">
                    {step.tasks.map((t, ti) => (
                      <li key={ti}>• {t}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Vendor Checklist & Risk Mitigation */}
        <div className="space-y-6">
          {/* Vendor Checklist */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                <Users className="w-4 h-4" /> Vendor Checklist
              </div>
              <button
                onClick={() => setActivePage('vendors')}
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
              >
                Manage Vendors <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {vendorChecklist.map((ven, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{ven.category}</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">{ven.action}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    ven.priority === 'Critical' ? 'bg-rose-500/10 text-rose-600' : 'bg-purple-500/10 text-purple-600'
                  }`}>
                    {ven.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Potential Risks & Backup Contingencies */}
          <div className="p-6 rounded-2xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/30 shadow-lg space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <ShieldAlert className="w-4 h-4" /> Potential Risks & Contingency Plans
            </div>
            <div className="space-y-3 text-xs">
              {risks.map((r, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-amber-500/20 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    Risk: {r.risk}
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 pl-5">
                    <strong className="text-emerald-600 dark:text-emerald-400">Backup Plan:</strong> {r.mitigation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
