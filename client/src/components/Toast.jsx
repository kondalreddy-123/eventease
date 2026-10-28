import React from 'react';
import { useEvents } from '../context/EventContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toast, showToast } = useEvents();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" aria-hidden="true" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" aria-hidden="true" />,
    info: <Info className="w-5 h-5 text-purple-500 shrink-0" aria-hidden="true" />
  };

  const borders = {
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100',
    error: 'border-rose-500/30 bg-rose-500/10 text-rose-950 dark:text-rose-100',
    info: 'border-purple-500/30 bg-purple-500/10 text-purple-950 dark:text-purple-100'
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 animate-bounce-short"
    >
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-xl max-w-md ${borders[toast.type] || borders.info}`}>
        {icons[toast.type] || icons.info}
        <p className="text-sm font-medium">{toast.message}</p>
        <button
          onClick={() => showToast(null)}
          aria-label="Dismiss notification"
          className="ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none rounded-lg p-0.5 transition-colors"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
