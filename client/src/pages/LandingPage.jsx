import React, { useState } from 'react';
import ThreeCanvas from '../components/ThreeCanvas';
import TiltCard from '../components/TiltCard';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  DollarSign,
  Heart,
  Cake,
  Users2,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Layers,
  Star,
  Check
} from 'lucide-react';

export default function LandingPage({ setActivePage }) {
  const { demoLogin, isAuthenticated } = useAuth();
  const [demoGuestCount, setDemoGuestCount] = useState(150);
  const [demoBudget, setDemoBudget] = useState(800000);
  const [demoEventType, setDemoEventType] = useState('Wedding');

  const handleDemoStart = async () => {
    await demoLogin();
    setActivePage('dashboard');
  };

  // Quick interactive cost projection on hero
  const projectedFood = Math.round(demoBudget * 0.32);
  const projectedVenue = Math.round(demoBudget * 0.35);
  const projectedDecor = Math.round(demoBudget * 0.15);
  const projectedBuffer = Math.round(demoBudget * 0.08);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background 3D celebratory canvas */}
      <div className="absolute inset-0 z-0 opacity-40 dark:opacity-60 pointer-events-none">
        <ThreeCanvas />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-bold tracking-wide uppercase shadow-sm backdrop-blur-md animate-bounce-short">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            Powered by Google Gemini 3.8 Intelligence
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Plan Smarter.{' '}
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 bg-clip-text text-transparent">
              Celebrate Better.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Your AI-powered event planning assistant for grand weddings, vibrant birthdays, and inspiring community celebrations. From budget optimization to vendor management and day-of schedules.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {isAuthenticated ? (
              <button
                onClick={() => setActivePage('dashboard')}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-xl shadow-purple-500/25 transition-all hover:scale-105 flex items-center gap-2"
              >
                Go to My Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => setActivePage('auth')}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-xl shadow-purple-500/25 transition-all hover:scale-105 flex items-center gap-2"
                >
                  Start Planning Free <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDemoStart}
                  className="px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold text-sm backdrop-blur-md shadow-md transition-all hover:scale-105 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  Explore Live Demo
                </button>
              </>
            )}
          </div>

          <div className="flex items-center justify-center gap-6 pt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> Instant Gemini AI generation</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> INR ₹ Budget tuning</span>
          </div>
        </div>

        {/* Interactive 3D Hero Demo Widget */}
        <div className="mt-12 max-w-4xl mx-auto">
          <TiltCard className="p-6 sm:p-8 bg-white/90 dark:bg-slate-900/90 border border-purple-500/20 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Interactive AI Estimator
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Test-Drive Your Celebration Estimates
                </h3>
              </div>
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {['Wedding', 'Birthday', 'Community'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setDemoEventType(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      demoEventType === type
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-purple-600'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-600 dark:text-slate-400">Expected Guests</span>
                    <span className="text-purple-600 dark:text-purple-400 font-extrabold text-sm">{demoGuestCount} Guests</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="600"
                    step="10"
                    value={demoGuestCount}
                    onChange={(e) => setDemoGuestCount(Number(e.target.value))}
                    className="w-full accent-purple-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-600 dark:text-slate-400">Target Budget (INR)</span>
                    <span className="text-purple-600 dark:text-purple-400 font-extrabold text-sm">₹{demoBudget.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="5000000"
                    step="50000"
                    value={demoBudget}
                    onChange={(e) => setDemoBudget(Number(e.target.value))}
                    className="w-full accent-purple-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs space-y-1">
                  <div className="font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> AI Recommendation
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    For {demoGuestCount} guests at ₹{(demoBudget / demoGuestCount).toFixed(0)}/head, we suggest reserving ₹{projectedBuffer.toLocaleString('en-IN')} as an emergency contingency reserve.
                  </p>
                </div>
              </div>

              {/* Real-time Allocation Card */}
              <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Suggested Smart Allocations
                </span>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-800">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Venue & Lawns (35%)</span>
                    <span className="font-bold text-slate-900 dark:text-white">₹{projectedVenue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-800">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Catering Spread (32%)</span>
                    <span className="font-bold text-slate-900 dark:text-white">₹{projectedFood.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-800">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Thematic Decor (15%)</span>
                    <span className="font-bold text-slate-900 dark:text-white">₹{projectedDecor.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="font-semibold text-amber-600 dark:text-amber-400">Emergency Reserve (8%)</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">₹{projectedBuffer.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  onClick={handleDemoStart}
                  className="w-full mt-2 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Generate Complete Event Plan
                </button>
              </div>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* Three Pillars: Weddings, Birthdays, Community */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Tailored Experiences
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Engineered for Every Milestone
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Dynamic planning intelligence that automatically adapts its prompts, budget allocations, and timelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Wedding Card */}
          <TiltCard className="p-6 bg-white dark:bg-slate-900 border border-purple-500/20 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Royal & Modern Weddings</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Multi-day scheduling (Mehendi, Sangeet, Pheras, Reception), guest room blocks, mandap decor, and traditional catering logistics.
            </p>
            <ul className="text-xs space-y-2 text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-600" /> Multi-day ritual timeline</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-600" /> Outstation guest accommodation</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-600" /> Photography & drone checklists</li>
            </ul>
          </TiltCard>

          {/* Birthday Card */}
          <TiltCard className="p-6 bg-white dark:bg-slate-900 border border-indigo-500/20 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Cake className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Vibrant Birthday Celebrations</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              From kids superhero & arcade themes to milestone 30th & 50th adult gala bashes, customized cake ideas, games, and entertainment.
            </p>
            <ul className="text-xs space-y-2 text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600" /> Age-calibrated party themes</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600" /> Custom cake & live snack bars</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600" /> Return gifts & games curation</li>
            </ul>
          </TiltCard>

          {/* Community Card */}
          <TiltCard className="p-6 bg-white dark:bg-slate-900 border border-emerald-500/20 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Users2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Community & Cultural Galas</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Publicity, ticketing/RSVPs, volunteer task assignment, municipal sound permits, accessibility, and safety compliance.
            </p>
            <ul className="text-xs space-y-2 text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Volunteer role coordination</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Eco-friendly zero waste initiatives</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Safety & first-aid checklists</li>
            </ul>
          </TiltCard>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Smart Capabilities
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Everything You Need Under One Roof
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-md">
            <Cpu className="w-8 h-8 text-purple-600 mb-3" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Gemini 3.8 Intelligence</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Structured real-time event plans with themes, color swatches, risks & timelines.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-md">
            <TrendingUp className="w-8 h-8 text-indigo-600 mb-3" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Smart Budget Health</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Recharts visualization, category breakdown, cost-saving recommendations.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-md">
            <Calendar className="w-8 h-8 text-pink-600 mb-3" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Dynamic Timeline</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Milestones that automatically calibrate due dates to your event date.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-md">
            <Layers className="w-8 h-8 text-amber-500 mb-3" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Vendor Comparison</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Track quoted vs agreed prices, payment status, ratings, and quotes.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>© 2026 EventEase AI — Plan Smarter. Celebrate Better. All rights reserved.</p>
      </footer>
    </div>
  );
}
