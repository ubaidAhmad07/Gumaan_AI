import React, { useRef } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { processEmails } from '../services/aiService.js';
import { sampleEmails } from '../utils/sampleEmails.js';

export default function EmailInput() {
  const { state, dispatch } = useApp();
  const { emailText, profile } = state;
  const fileRef = useRef(null);

  const parseEmails = (text) => {
    if (!text.trim()) return [];
    const parts = text.split(/\n---+\n|\n===+\n/).filter(e => e.trim().length > 20);
    if (parts.length > 1) return parts.map(p => p.trim());
    const bySubject = text.split(/(?=Subject:)/i).filter(e => e.trim().length > 20);
    if (bySubject.length > 1) return bySubject.map(p => p.trim());
    return [text.trim()];
  };

  const emailCount = parseEmails(emailText).length;

  const loadSamples = () => dispatch({ type: 'SET_EMAIL_TEXT', payload: sampleEmails.join('\n\n---\n\n') });

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    let allText = emailText;
    for (const file of files) {
      const text = await file.text();
      allText += (allText ? '\n\n---\n\n' : '') + text;
    }
    dispatch({ type: 'SET_EMAIL_TEXT', payload: allText });
    e.target.value = '';
  };

  const handleProcess = async () => {
    const emails = parseEmails(emailText);
    if (emails.length === 0) return;
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const results = await processEmails(emails, profile);
      dispatch({ type: 'SET_RESULTS', payload: results });
      dispatch({ type: 'SET_STEP', payload: 2 });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  };

  return (
    <div>
      {state.error && (
        <div className="error-box">
          ⚠️ {state.error}
          <button className="btn btn-ghost btn-sm" style={{ marginLeft: 12 }}
            onClick={() => dispatch({ type: 'SET_ERROR', payload: null })}>Dismiss</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
        {/* Raw Content Injection */}
        <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom right, var(--surface-container-low) 0%, transparent 50%)', opacity: 0, transition: 'opacity 0.3s' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div className="card-section-title" style={{ marginBottom: 4 }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>alternate_email</span>
                  Raw Content Injection
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>
                  Paste full email threads, headers, or plain text logs directly.
                </p>
              </div>
              <span className="material-symbols-outlined" style={{ color: 'var(--outline)' }}>content_paste</span>
            </div>

            <div className="email-actions">
              <button className="sample-btn" onClick={loadSamples}>
                <span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: 'middle', marginRight: 4 }}>auto_awesome</span>
                Load Sample Emails
              </button>
              <button className="sample-btn" onClick={() => fileRef.current?.click()}>
                <span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: 'middle', marginRight: 4 }}>upload_file</span>
                Upload File
              </button>
              <input ref={fileRef} type="file" accept=".txt,.eml" multiple onChange={handleFileUpload} style={{ display: 'none' }} />
            </div>

            <textarea className="form-textarea large" value={emailText}
              onChange={(e) => dispatch({ type: 'SET_EMAIL_TEXT', payload: e.target.value })}
              placeholder={"To: student@university.edu\nFrom: admissions@college.edu\nSubject: Scholarship Opportunity\n\nFollowing up on the fellowship program...\n\n---\n\nSubject: Internship Opening\nHi, we are accepting applications..."} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, padding: '0 8px' }}>
              <span className="form-help">Accepts plain text, HTML, or standard email headers. Separate with ---</span>
              <span className="email-counter"><span className="email-counter-num">{emailCount}</span> {emailCount === 1 ? 'email' : 'emails'} detected</span>
            </div>
          </div>
        </div>

        <div className="btn-group">
          <button className="btn btn-secondary" onClick={() => dispatch({ type: 'SET_STEP', payload: 0 })}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span> Back to Profile
          </button>
          <button className="btn btn-primary btn-lg" disabled={emailCount === 0} onClick={handleProcess}>
            Submit Emails for Analysis
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
