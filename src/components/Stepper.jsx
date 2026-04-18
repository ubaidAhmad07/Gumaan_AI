import React from 'react';
import { useApp } from '../context/AppContext.jsx';

const steps = [
  { label: 'Student Profile', icon: '👤' },
  { label: 'Email Input', icon: '📧' },
  { label: 'Results', icon: '📊' },
];

export default function Stepper() {
  const { state, dispatch } = useApp();
  const { currentStep } = state;

  const canGoTo = (idx) => {
    if (idx === 0) return true;
    if (idx === 1) return state.profile.name && state.profile.program;
    if (idx === 2) return state.results !== null;
    return false;
  };

  return (
    <div className="stepper">
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <div className={`step-connector ${i <= currentStep ? 'completed' : ''}`} />
          )}
          <div
            className={`step ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'completed' : ''}`}
            onClick={() => canGoTo(i) && dispatch({ type: 'SET_STEP', payload: i })}
            style={{ cursor: canGoTo(i) ? 'pointer' : 'not-allowed', opacity: canGoTo(i) ? 1 : 0.5 }}
          >
            <div className="step-number">
              {i < currentStep ? '✓' : step.icon}
            </div>
            <span>{step.label}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
