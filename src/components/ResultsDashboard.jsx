import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import OpportunityCard from './OpportunityCard.jsx';

export default function ResultsDashboard() {
  const { state, dispatch } = useApp();
  const { results } = state;
  if (!results) return null;

  const opportunities = results.opportunities || [];
  const rejected = results.rejected || [];

  return (
    <div>
      {/* AI Summary */}
      {results.summary && (
        <div className="summary-card">
          <div className="summary-card-inner">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--secondary)' }}>psychology</span>
              <h3 className="headline" style={{ fontSize: '1.15rem', fontWeight: 700 }}>Cognitive Analysis</h3>
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--on-surface-variant)', lineHeight: 1.7 }}>{results.summary}</p>
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="results-header">
        <div>
          <h2 className="headline" style={{ fontSize: '1.4rem', fontWeight: 700 }}>
            {opportunities.length > 0 ? 'High-Yield Matches' : 'Results'}
          </h2>
          <div className="results-count">
            Found <strong>{opportunities.length}</strong> genuine {opportunities.length === 1 ? 'opportunity' : 'opportunities'}
            {rejected.length > 0 && <> · {rejected.length} filtered</>}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="page-header-badge">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--secondary)' }} />
            Analysis Complete
          </span>
        </div>
      </div>

      {/* Cards */}
      {opportunities.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 64 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--outline)', marginBottom: 16, display: 'block' }}>search_off</span>
          <h3 className="headline" style={{ fontSize: '1.1rem', marginBottom: 8 }}>No genuine opportunities found</h3>
          <p style={{ color: 'var(--on-surface-variant)' }}>The emails provided don't appear to contain relevant opportunities.</p>
        </div>
      ) : (
        opportunities.map((opp, i) => <OpportunityCard key={i} opp={opp} rank={i + 1} />)
      )}

      {/* Rejected */}
      {rejected.length > 0 && (
        <div className="card rejected-card" style={{ marginTop: 24 }}>
          <div className="card-section-title">
            <span className="material-symbols-outlined" style={{ color: 'var(--outline)' }}>filter_list</span>
            Filtered Out ({rejected.length})
          </div>
          {rejected.map((r, i) => (
            <div key={i} style={{ padding: '4px 0', fontSize: '0.85rem', color: 'var(--outline)' }}>
              Email #{r.emailIndex + 1}: {r.reason}
            </div>
          ))}
        </div>
      )}

      <div className="btn-group" style={{ marginTop: 32 }}>
        <button className="btn btn-secondary" onClick={() => dispatch({ type: 'SET_STEP', payload: 1 })}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span> Back to Emails
        </button>
        <button className="btn btn-primary" onClick={() => { dispatch({ type: 'RESET' }); dispatch({ type: 'SET_STEP', payload: 0 }); }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>refresh</span> Start Over
        </button>
      </div>
    </div>
  );
}
