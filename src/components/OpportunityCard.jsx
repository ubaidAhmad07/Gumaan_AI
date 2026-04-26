import React, { useState } from 'react';

export default function OpportunityCard({ opp, rank }) {
  const [expanded, setExpanded] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState({});
  const toggleCheck = (idx) => setCheckedSteps(prev => ({ ...prev, [idx]: !prev[idx] }));

  const typeLower = (opp.type || 'other').toLowerCase().replace(/\s+/g, '-');
  const badgeClass = `badge badge-${typeLower}`;

  return (
    <div className="opp-card" style={{ animationDelay: `${rank * 60}ms` }}>
      <div className="opp-card-header">
        <div style={{ flex: 1 }}>
          <div className="opp-card-badges">
            <span className={badgeClass}>{opp.type}</span>
            {opp.fieldMatch && (
              <span className={`badge badge-field-${(opp.fieldMatch || '').toLowerCase().replace(/\s+/g, '-')}`}>
                {opp.fieldMatch === 'Exact Match' ? '✓ ' : opp.fieldMatch === 'Mismatch' ? '✗ ' : ''}{opp.fieldMatch}
              </span>
            )}
            {opp.organization && <span style={{ fontFamily: 'Inter', fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>{opp.organization}</span>}
          </div>
          <div className="opp-card-title">{opp.title}</div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div className="opp-match-score">{opp.overallScore}% Match</div>
          <div style={{ fontFamily: 'Inter', fontSize: '0.72rem', color: 'var(--on-surface-variant)' }}>
            {opp.deadline && opp.deadline !== 'Not specified' ? `Deadline: ${opp.deadline}` : 'Rolling'}
          </div>
        </div>
      </div>

      <p className="opp-card-desc">{opp.fitReason}</p>

      <div className="score-bars">
        {[{ label: 'Profile Fit', val: opp.profileFitScore }, { label: 'Urgency', val: opp.urgencyScore }, { label: 'Completeness', val: opp.completenessScore }].map(s => (
          <div className="score-bar" key={s.label}>
            <div className="score-bar-label"><span>{s.label}</span><span>{s.val}%</span></div>
            <div className="score-bar-track"><div className="score-bar-fill" style={{ width: `${s.val}%` }} /></div>
          </div>
        ))}
      </div>

      <button className="opp-card-expand" onClick={() => setExpanded(!expanded)}>
        {expanded ? 'Hide Details' : 'View Details'}
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{expanded ? 'expand_less' : 'arrow_forward'}</span>
      </button>

      {expanded && (
        <div className="opp-details">
          <div className="opp-details-grid">
            {opp.eligibility?.length > 0 && (
              <div className="opp-detail-section">
                <h4><span className="material-symbols-outlined">school</span> Eligibility</h4>
                <ul className="opp-detail-list">{opp.eligibility.map((e, i) => <li key={i}>{e}</li>)}</ul>
              </div>
            )}
            {opp.requiredDocuments?.length > 0 && (
              <div className="opp-detail-section">
                <h4><span className="material-symbols-outlined">description</span> Documents</h4>
                <ul className="opp-detail-list">{opp.requiredDocuments.map((d, i) => <li key={i}>{d}</li>)}</ul>
              </div>
            )}
          </div>

          {opp.benefits && (
            <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)', marginBottom: 12 }}>
              <strong>Benefits:</strong> {opp.benefits}
            </p>
          )}

          {opp.applicationLink && opp.applicationLink !== 'Not provided' && (
            <p style={{ fontSize: '0.85rem', marginBottom: 12 }}>
              <a className="opp-card-link" href={opp.applicationLink} target="_blank" rel="noreferrer">
                Apply Here <span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: 'middle' }}>open_in_new</span>
              </a>
            </p>
          )}

          {opp.actionSteps?.length > 0 && (
            <div>
              <h4 style={{ fontFamily: 'Manrope', fontSize: '0.82rem', fontWeight: 700, color: 'var(--on-surface)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--primary)' }}>check_circle</span> Action Items
              </h4>
              <div className="checklist">
                {opp.actionSteps.map((step, i) => (
                  <div key={i} className="checklist-item">
                    <button className={`checklist-btn ${checkedSteps[i] ? 'checked' : ''}`} onClick={() => toggleCheck(i)}>
                      <span className="material-symbols-outlined" style={checkedSteps[i] ? { fontVariationSettings: "'FILL' 1" } : {}}>
                        {checkedSteps[i] ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                    </button>
                    <span className={`checklist-text ${checkedSteps[i] ? 'checked' : ''}`}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
