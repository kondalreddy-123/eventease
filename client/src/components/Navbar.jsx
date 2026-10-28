import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { useTheme } from '../context/ThemeContext';
import {
  Sparkles,
  Calendar,
  DollarSign,
  CheckSquare,
  Users,
  Lightbulb,
  LayoutDashboard,
  Plus,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  Settings,
  PartyPopper,
  ShieldCheck,
  Layers
} from 'lucide-react';

export default function Navbar({ activePage, setActivePage }) {
  const { user, isAuthenticated, isDemo, logout } = useAuth();
  const { events, currentEvent, currentEventId, selectEvent } = useEvents();
  const { isDark, toggleTheme } = useTheme();

  const [eventDropdownOpen, setEventDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'plan', label: 'AI Plan', icon: Sparkles },
    { id: 'budget', label: 'Budget', icon: DollarSign },
    { id: 'timeline', label: 'Timeline', icon: CheckSquare },
    { id: 'vendors', label: 'Vendors', icon: Users },
    { id: 'ideas', label: 'AI Ideas', icon: Lightbulb },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActivePage(isAuthenticated ? 'dashboard' : 'landing')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 bg-clip-text text-transparent dark:from-purple-400 dark:via-indigo-300 dark:to-purple-300">
                  EventEase<span className="text-purple-600 dark:text-purple-400">.ai</span>
                </span>
                <span className="hidden sm:block text-[10px] tracking-wider uppercase font-semibold text-slate-600 dark:text-slate-400">
                  Plan Smarter. Celebrate Better.
                </span>
              </div>
            </button>

            {/* Active Event Selector (When Authenticated) */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setEventDropdownOpen(!eventDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/60 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors"
                >
                  <PartyPopper className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span className="max-w-[140px] md:max-w-[180px] truncate">
                    {currentEvent ? currentEvent.name : 'Select Event'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                </button>

                {eventDropdownOpen && (
                  <div
                    className="absolute left-0 mt-2 w-72 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setEventDropdownOpen(false)}
                  >
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/80">
                      Your Events ({events.length})
                    </div>
                    <div className="max-h-60 overflow-y-auto py-1">
                      {events.length === 0 ? (
                        <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400">No events found.</div>
                      ) : (
                        events.map(evt => (
                          <button
                            key={evt.id}
                            onClick={() => {
                              selectEvent(evt.id);
                              setEventDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors ${
                              evt.id === currentEventId
                                ? 'bg-purple-500/10 text-purple-700 dark:text-purple-300 font-bold'
                                : 'text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span className="truncate pr-2">{evt.name}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase">
                              {evt.eventType}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                    <div className="border-t border-slate-100 dark:border-slate-800/80 px-2 pt-1.5">
                      <button
                        onClick={() => {
                          setActivePage('create-event');
                          setEventDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Create New Event
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Center Navigation Links (When authenticated) */}
          {isAuthenticated && (
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/20'
                        : 'text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
            </button>

            {isAuthenticated ? (
              <>
                {/* Create Event Button */}
                <button
                  onClick={() => setActivePage('create-event')}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-sm shadow-purple-500/20 transition-all hover:scale-102"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Event</span>
                </button>

                {/* Demo Badge */}
                {isDemo && (
                  <span className="hidden md:flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <ShieldCheck className="w-3 h-3" /> Demo Mode
                  </span>
                )}

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1 pl-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden sm:inline text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                      {user?.name || 'User'}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-52 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-1.5 z-50 animate-in fade-in"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{user?.name}</p>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setActivePage('settings');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-xs flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" /> Event Settings
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setActivePage('landing');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-xs flex items-center gap-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActivePage('auth')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-purple-600 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => setActivePage('auth')}
                  className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/20 transition-all hover:scale-102"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Sub-Navigation for Authenticated Users */}
        {isAuthenticated && (
          <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 dark:border-slate-900 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
