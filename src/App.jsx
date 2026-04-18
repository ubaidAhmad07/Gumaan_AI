import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext.jsx';
import StudentProfileForm from './components/StudentProfileForm.jsx';
import EmailInput from './components/EmailInput.jsx';
import ResultsDashboard from './components/ResultsDashboard.jsx';
import LoadingIndicator from './components/LoadingIndicator.jsx';

function LiveTime() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="live-time">
      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>schedule</span>
      {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </div>
  );
}

function Sidebar() {
  const { state, dispatch } = useApp();
  const { currentStep, sidebarOpen } = state;

  const navItems = [
    { icon: 'person', label: 'Profile', step: 0, filled: true },
    { icon: 'alternate_email', label: 'Add Emails', step: 1 },
    { icon: 'dashboard', label: 'Overview', step: 2 },
  ];

  const canGoTo = (step) => {
    if (step === 0) return true;
    if (step === 1) return state.profile.name && state.profile.program;
    if (step === 2) return state.results !== null;
    return false;
  };

  return (
    <>
      {sidebarOpen && <div className="mobile-overlay" onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 39 }} />}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo">G</div>
            <div>
              <div className="sidebar-title">GUMAAN AI</div>
              <div className="sidebar-subtitle">Opportunity Copilot</div>
            </div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.step}
              className={`nav-item ${currentStep === item.step ? 'active' : ''}`}
              onClick={() => {
                if (canGoTo(item.step)) {
                  dispatch({ type: 'SET_STEP', payload: item.step });
                  dispatch({ type: 'TOGGLE_SIDEBAR' });
                }
              }}
              style={{ opacity: canGoTo(item.step) ? 1 : 0.4, cursor: canGoTo(item.step) ? 'pointer' : 'not-allowed' }}
            >
              <span className="material-symbols-outlined"
                style={currentStep === item.step ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-credits">
            <strong>Developed by</strong><br />
            Ubaid Ahmad, Hafiz Abdullah &amp; Aaiz Ahmed<br />
            Students of Information Technology University
          </div>
        </div>
      </aside>
    </>
  );
}

function MobileHeader() {
  const { dispatch } = useApp();
  return (
    <div className="mobile-header">
      <button className="btn-ghost" onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })} style={{ padding: 4 }}>
        <span className="material-symbols-outlined">menu</span>
      </button>
      <span style={{ fontFamily: 'Space Grotesk', fontWeight: 900, color: '#312e81', fontSize: '1.1rem' }}>GUMAAN AI</span>
      <div style={{ width: 28 }} />
    </div>
  );
}

const PAGE_CONFIG = {
  0: { badge: 'Profile Setup', icon: 'person', title: 'Curate Your Profile', subtitle: 'Define your parameters to unlock precision-matched opportunities.' },
  1: { badge: 'Data Ingestion', icon: 'auto_awesome', title: 'Curate Email Data', subtitle: 'Inject raw opportunity emails into the GUMAAN AI engine for analysis and ranking.' },
  2: { badge: 'Analysis Complete', icon: 'check_circle', title: 'Curated Opportunities', subtitle: 'AI-driven analysis of your profile against submitted opportunities. Ranked by matching probability.' },
};

function AppContent() {
  const { state } = useApp();
  const { currentStep, loading } = state;
  const page = PAGE_CONFIG[currentStep];

  return (
    <div className="app-layout">
      <Sidebar />
      <MobileHeader />
      <main className="main-content">
        <LiveTime />
        <div className="page-header">
          <div className="page-header-badge">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{page.icon}</span>
            {page.badge}
          </div>
          <h1 className="page-title headline">{page.title}</h1>
          <p className="page-subtitle">{page.subtitle}</p>
        </div>

        {loading ? (
          <LoadingIndicator />
        ) : (
          <>
            {currentStep === 0 && <StudentProfileForm />}
            {currentStep === 1 && <EmailInput />}
            {currentStep === 2 && <ResultsDashboard />}
          </>
        )}

        <footer className="footer">
          <strong>GUMAAN AI</strong> — Smart Opportunity Copilot<br />
          Developed by <strong>Ubaid Ahmad</strong>, <strong>Hafiz Abdullah</strong> &amp; <strong>Aaiz Ahmed</strong><br />
          Students of Information Technology University
        </footer>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
