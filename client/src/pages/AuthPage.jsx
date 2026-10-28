import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ShieldCheck, Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import ThreeCanvas from '../components/ThreeCanvas';
import TiltCard from '../components/TiltCard';

export default function AuthPage({ setActivePage }) {
  const { login, register, demoLogin } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login({ email, password });
      } else {
        await register({ name, email, password });
      }
      setActivePage('dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setError('');
    setLoading(true);
    try {
      await demoLogin();
      setActivePage('dashboard');
    } catch (err) {
      setError('Failed to start demo session: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      {/* Subtle 3D background */}
      <div className="absolute inset-0 z-0 opacity-30 dark:opacity-50 pointer-events-none">
        <ThreeCanvas interactive={false} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <TiltCard className="p-8 bg-white/95 dark:bg-slate-900/95 border border-purple-500/20 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 items-center justify-center text-white shadow-lg shadow-purple-500/25 mb-3">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {mode === 'login' ? 'Welcome Back' : 'Create Free Account'}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              EventEase AI — Your Smart Event Planner
            </p>
          </div>

          {/* Quick Instant Demo Option */}
          <button
            type="button"
            onClick={handleDemo}
            disabled={loading}
            className="w-full mb-6 py-2.5 px-4 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 hover:from-amber-500/20 hover:to-indigo-500/20 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>Instant Demo Mode (Pre-loaded Events)</span>
          </button>

          <div className="relative flex py-2 items-center mb-4">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-3 text-[11px] uppercase font-bold text-slate-600 dark:text-slate-400">
              Or sign in with email
            </span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          {error && (
            <div role="alert" aria-live="assertive" className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label htmlFor="auth-name" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-600 dark:text-slate-400" aria-hidden="true" />
                  <input
                    id="auth-name"
                    type="text"
                    required
                    aria-required="true"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 dark:text-white transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="auth-email" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-600 dark:text-slate-400" aria-hidden="true" />
                <input
                  id="auth-email"
                  type="email"
                  required
                  aria-required="true"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 dark:text-white transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="auth-password" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-600 dark:text-slate-400" aria-hidden="true" />
                <input
                  id="auth-password"
                  type="password"
                  required
                  aria-required="true"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 dark:text-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              aria-label={mode === 'login' ? 'Sign in to EventEase AI' : 'Create new account on EventEase AI'}
              aria-busy={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-purple-500/25 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            >
              {loading ? (
                <span className="inline-block animate-spin">⏳</span>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="text-center mt-6 text-xs text-slate-600 dark:text-slate-400">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Log In
                </button>
              </p>
            )}
          </div>
        </TiltCard>
      </div>
    </div>
  );
}
