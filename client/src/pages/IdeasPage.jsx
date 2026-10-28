import React, { useState, useEffect } from 'react';
import { useEvents } from '../context/EventContext';
import { api } from '../services/api';
import TiltCard from '../components/TiltCard';
import {
  Lightbulb,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  RotateCw,
  Palette,
  Utensils,
  Mail,
  Music,
  Gift,
  Camera,
  Leaf,
  DollarSign,
  TrendingDown,
  Trash2,
  Check
} from 'lucide-react';

const TOPICS = [
  { id: 'all', label: 'All Creative Sparks', icon: Sparkles },
  { id: 'Themes', label: 'Unique Themes', icon: Palette },
  { id: 'Decor', label: 'Decor Concepts', icon: Sparkles },
  { id: 'Food & Menu', label: 'Food & Menu Twists', icon: Utensils },
  { id: 'Invitation wording', label: 'Invitation Wording', icon: Mail },
  { id: 'Entertainment', label: 'Activities & Games', icon: Music },
  { id: 'Return gifts', label: 'Return Favors & Gifts', icon: Gift },
  { id: 'Photography', label: 'Photo Concepts', icon: Camera },
  { id: 'Eco-friendly', label: 'Eco-Friendly Ideas', icon: Leaf },
  { id: 'Low-budget', label: 'Budget-Saving Swaps', icon: TrendingDown },
];

export default function IdeasPage({ setActivePage }) {
  const { currentEvent, savedIdeas, saveIdea, deleteIdea, showToast } = useEvents();

  const [activeTopic, setActiveTopic] = useState('all');
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchIdeas = async (topic = activeTopic) => {
    try {
      setLoading(true);
      const res = await api.generateIdeas({
        eventType: currentEvent?.eventType || 'Wedding',
        topic,
        guestCount: currentEvent?.guestCount || 100,
        budget: currentEvent?.totalBudget || 500000,
        theme: currentEvent?.theme || 'Celebration'
      });
      setIdeas(res.ideas || []);
    } catch (err) {
      console.warn('Failed to load ideas:', err);
      showToast('Could not load AI ideas.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas(activeTopic);
  }, [activeTopic, currentEvent]);

  const isSaved = (idea) => {
    return savedIdeas.some(si => si.title === idea.title);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Dedicated Creative Studio
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Personalized AI Ideas Generator
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Fresh, culturally attuned concepts tailored to {currentEvent?.name || 'your celebration'} by Gemini 3.8.
          </p>
        </div>

        <button
          onClick={() => fetchIdeas(activeTopic)}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all hover:scale-105 flex items-center gap-2 self-start md:self-auto disabled:opacity-60"
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Consulting Gemini...' : 'Regenerate Ideas'}</span>
        </button>
      </div>

      {/* Topic Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {TOPICS.map((topic) => {
          const Icon = topic.icon;
          const isSelected = activeTopic === topic.id;
          return (
            <button
              key={topic.id}
              onClick={() => setActiveTopic(topic.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-purple-400'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{topic.label}</span>
            </button>
          );
        })}
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-16 text-center space-y-3">
            <div className="w-10 h-10 mx-auto rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center animate-spin">
              ✨
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              Gemini AI is crafting bespoke creative concepts...
            </p>
          </div>
        ) : ideas.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            Click "Regenerate Ideas" to spark new suggestions for this topic.
          </div>
        ) : (
          ideas.map((idea, idx) => {
            const saved = isSaved(idea);
            return (
              <TiltCard
                key={idea.id || idx}
                className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                      {idea.category || activeTopic}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                      Impact: {idea.budgetImpact || 'Moderate'}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {idea.title}
                  </h3>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {idea.description}
                  </p>

                  {idea.culturalFit && (
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-1.5 pt-1">
                      <span className="font-bold text-purple-600 dark:text-purple-400">Fit:</span>
                      <span>{idea.culturalFit}</span>
                    </div>
                  )}

                  {idea.practicalTip && (
                    <div className="p-3 rounded-xl bg-purple-500/5 dark:bg-purple-950/20 border border-purple-500/20 text-[11px] text-purple-900 dark:text-purple-300">
                      💡 <strong>Action Tip:</strong> {idea.practicalTip}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (!saved) saveIdea(idea);
                    }}
                    disabled={saved}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      saved
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 cursor-default'
                        : 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/20 hover:scale-[1.01]'
                    }`}
                  >
                    {saved ? (
                      <>
                        <BookmarkCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Pinned to Event</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Pin Idea to My Event</span>
                      </>
                    )}
                  </button>
                </div>
              </TiltCard>
            );
          })
        )}
      </div>

      {/* Pinned Bookmarked Ideas Section */}
      {savedIdeas.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4 text-purple-600" />
              Pinned Event Ideas ({savedIdeas.length})
            </h3>
            <span className="text-xs text-slate-600 dark:text-slate-400">Customized Collection</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedIdeas.map((saved) => (
              <div
                key={saved.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs relative group"
              >
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-bold text-slate-900 dark:text-white">{saved.title}</h4>
                  <button
                    onClick={() => deleteIdea(saved.id)}
                    className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                    title="Remove Idea"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                  {saved.description}
                </p>
                {saved.practicalTip && (
                  <p className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
                    Tip: {saved.practicalTip}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
