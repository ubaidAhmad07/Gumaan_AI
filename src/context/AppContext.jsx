import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  currentStep: 0, // 0=profile, 1=emails, 2=results
  apiKey: import.meta.env.VITE_GROQ_API_KEY || '',
  profile: JSON.parse(localStorage.getItem('student_profile') || 'null') || {
    name: '',
    program: '',
    semester: '',
    cgpa: '',
    skills: [],
    preferredTypes: [],
    financialNeed: '',
    location: 'Any',
    experience: '',
  },
  emails: [],
  emailText: '',
  results: null,
  loading: false,
  error: null,
  sidebarOpen: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_PROFILE':
      const newProfile = { ...state.profile, ...action.payload };
      localStorage.setItem('student_profile', JSON.stringify(newProfile));
      return { ...state, profile: newProfile };
    case 'SET_EMAIL_TEXT':
      return { ...state, emailText: action.payload };
    case 'SET_RESULTS':
      return { ...state, results: action.payload, loading: false, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'RESET':
      return { ...initialState, apiKey: state.apiKey, profile: state.profile };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
