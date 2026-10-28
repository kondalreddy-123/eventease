import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EventProvider } from './context/EventContext';
import Navbar from './components/Navbar';
import Toast from './components/Toast';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import CreateEventPage from './pages/CreateEventPage';
import EventPlanPage from './pages/EventPlanPage';
import BudgetPage from './pages/BudgetPage';
import TimelinePage from './pages/TimelinePage';
import VendorPage from './pages/VendorPage';
import IdeasPage from './pages/IdeasPage';
import SettingsPage from './pages/SettingsPage';

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
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1">
        {renderPage()}
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
