import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { SignInButton, SignUpButton, UserButton, useAuth, SignIn, SignUp } from '@clerk/react';
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
  const { userId } = useAuth();

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
        <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '1rem' }}>
          <div className="sidebar-brand">
            <div className="sidebar-logo">G</div>
            <div>
              <div className="sidebar-title">GUMAAN AI</div>
              <div className="sidebar-subtitle">Opportunity Copilot</div>
            </div>
          </div>
          {userId && (
            <UserButton />
          )}
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
  const { userId } = useAuth();
  return (
    <div className="mobile-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <button className="btn-ghost" onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })} style={{ padding: 4 }}>
        <span className="material-symbols-outlined">menu</span>
      </button>
      <span style={{ fontFamily: 'Space Grotesk', fontWeight: 900, color: '#312e81', fontSize: '1.1rem' }}>GUMAAN AI</span>
      <div>
        {userId && (
          <UserButton />
        )}
      </div>
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

function Home() {
  const { userId } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8fafc' }}>
      <h1 style={{ fontFamily: 'Space Grotesk', color: '#312e81', fontSize: '3rem', marginBottom: '1rem' }}>GUMAAN AI</h1>
      <p style={{ color: '#64748b', fontSize: '1.2rem', marginBottom: '2rem' }}>Opportunity Copilot for Students</p>
      
      {!userId ? (
        <div style={{ display: 'flex', gap: '1rem' }}>
          <SignInButton mode="modal">
            <button style={{ padding: '0.75rem 1.5rem', background: '#4f46e5', color: '#fff', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Sign In</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button style={{ padding: '0.75rem 1.5rem', background: '#fff', color: '#4f46e5', border: '1px solid #4f46e5', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Sign Up</button>
          </SignUpButton>
        </div>
      ) : (
        <Link to="/dashboard" style={{ padding: '0.75rem 1.5rem', background: '#4f46e5', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
          Go to Dashboard
        </Link>
      )}
    </div>
  );
}

function ProtectedDashboard() {
  const { isLoaded, userId } = useAuth();

  if (!isLoaded) return <LoadingIndicator />;
  if (!userId) return <Navigate to="/sign-in" />;

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in/*" element={<div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><SignIn routing="path" path="/sign-in" /></div>} />
        <Route path="/sign-up/*" element={<div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><SignUp routing="path" path="/sign-up" /></div>} />
        <Route path="/dashboard" element={<ProtectedDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
