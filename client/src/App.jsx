import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EventProvider } from './context/EventContext';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import { Sparkles } from 'lucide-react';

// Lazy-loaded pages for high performance and reduced initial bundle size
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const CreateEventPage = lazy(() => import('./pages/CreateEventPage'));
const EventPlanPage = lazy(() => import('./pages/EventPlanPage'));
const BudgetPage = lazy(() => import('./pages/BudgetPage'));
const TimelinePage = lazy(() => import('./pages/TimelinePage'));
const VendorPage = lazy(() => import('./pages/VendorPage'));
const IdeasPage = lazy(() => import('./pages/IdeasPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

function PageFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center space-y-3"
    >
      <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center animate-spin">
        <Sparkles className="w-5 h-5" aria-hidden="true" />
      </div>
      <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
        Loading view...
      </p>
    </div>
  );
}

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [activePage, setActivePage] = useState('landing');

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        if (activePage === 'landing' || activePage === 'auth') {
          setActivePage('dashboard');
        }
      } else {
        if (activePage !== 'landing' && activePage !== 'auth') {
          setActivePage('landing');
        }
      }
    }
  }, [isAuthenticated, loading]);

  const renderPage = () => {
    switch (activePage) {
      case 'landing':
        return <LandingPage setActivePage={setActivePage} />;
      case 'auth':
        return <AuthPage setActivePage={setActivePage} />;
      case 'dashboard':
        return <DashboardPage setActivePage={setActivePage} />;
      case 'create-event':
        return <CreateEventPage setActivePage={setActivePage} />;
      case 'plan':
        return <EventPlanPage setActivePage={setActivePage} />;
      case 'budget':
        return <BudgetPage setActivePage={setActivePage} />;
      case 'timeline':
        return <TimelinePage setActivePage={setActivePage} />;
      case 'vendors':
        return <VendorPage setActivePage={setActivePage} />;
      case 'ideas':
        return <IdeasPage setActivePage={setActivePage} />;
      case 'settings':
        return <SettingsPage setActivePage={setActivePage} />;
      default:
        return <LandingPage setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Accessible skip link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-xl focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      <Navbar activePage={activePage} setActivePage={setActivePage} />

      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <Suspense fallback={<PageFallback />}>
          {renderPage()}
        </Suspense>
      </main>

      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EventProvider>
          <AppContent />
        </EventProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
