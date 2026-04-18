import React from 'react';
import { useApp } from '../context/AppContext.jsx';

export default function Header() {
  const { state } = useApp();
  return (
    <header className="header">
      <div className="header-brand">
        <div className="header-logo">O</div>
        <div>
          <div className="header-title">
            <span className="gradient-text">OpportunityAI</span>
          </div>
          <div className="header-subtitle">Smart Inbox Copilot</div>
        </div>
      </div>
      <div className="header-badge">✨ AI-Powered</div>
    </header>
  );
}
