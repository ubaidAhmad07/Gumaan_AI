import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

const PROGRAMS = [
  'Computer Science', 'Artificial Intelligence', 'Data Science',
  'Software Engineering', 'Electrical Engineering', 'Mechanical Engineering',
  'Business Administration', 'Economics', 'Mathematics', 'Physics',
  'Biomedical Engineering', 'Social Sciences', 'Law', 'Medicine', 'Arts & Design', 'Other'
];
const SEMESTERS = ['1st - 2nd', '3rd - 4th', '5th - 6th', '7th - 8th', 'Graduate'];
const OPP_TYPES = ['Scholarships', 'Internships', 'Competitions', 'Fellowships', 'Admissions', 'Financial Aid'];
const SKILLS = ['Coding', 'Research', 'Leadership', 'Design', 'Data Analysis', 'Writing', 'Public Speaking'];

export default function StudentProfileForm() {
  const { state, dispatch } = useApp();
  const { profile } = state;
  const [skillInput, setSkillInput] = useState('');

  const update = (field, value) => dispatch({ type: 'SET_PROFILE', payload: { [field]: value } });

  const addSkill = (skill) => {
    if (skill && !profile.skills.includes(skill)) {
      update('skills', [...profile.skills, skill]);
    }
  };
  const removeSkill = (skill) => update('skills', profile.skills.filter(s => s !== skill));
  const toggleType = (type) => {
    const types = profile.preferredTypes || [];
    update('preferredTypes', types.includes(type) ? types.filter(t => t !== type) : [...types, type]);
  };

  const canProceed = profile.name && profile.program && profile.cgpa;

  return (
    <div className="card">
      <div className="card-section-title">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", color: 'var(--secondary)' }}>person</span>
        Student Profile
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input className="form-input" placeholder="e.g. Ahmed Khan" value={profile.name}
            onChange={(e) => update('name', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Degree / Program *</label>
          <select className="form-select" value={profile.program} onChange={(e) => update('program', e.target.value)}>
            <option value="">Select Program</option>
            {PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Semester</label>
          <select className="form-select" value={profile.semester} onChange={(e) => update('semester', e.target.value)}>
            <option value="">Select Semester</option>
            {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Current CGPA *</label>
          <input className="form-input" type="number" step="0.01" min="0" max="4.0" placeholder="e.g. 3.85"
            value={profile.cgpa} onChange={(e) => update('cgpa', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Financial Need Context</label>
          <input className="form-input" placeholder="Optional brief context" value={profile.financialNeed}
            onChange={(e) => update('financialNeed', e.target.value)} />
        </div>

        {/* Skills */}
        <div className="form-group full-span" style={{ marginTop: 8 }}>
          <label className="form-label">Skills & Interests</label>
          <div className="checkbox-group" style={{ marginBottom: 8 }}>
            {SKILLS.map(s => (
              <label key={s} className={`checkbox-pill ${profile.skills.includes(s) ? 'selected' : ''}`}>
                <input type="checkbox" checked={profile.skills.includes(s)}
                  onChange={() => profile.skills.includes(s) ? removeSkill(s) : addSkill(s)} />
                {s}
              </label>
            ))}
          </div>
          <div className="tags-container">
            {profile.skills.filter(s => !SKILLS.includes(s)).map(skill => (
              <span key={skill} className="tag">
                {skill}
                <button className="tag-remove" onClick={() => removeSkill(skill)}>×</button>
              </span>
            ))}
            <input className="tag-input" placeholder="Add custom skill, press Enter..."
              value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && skillInput.trim()) {
                  e.preventDefault(); addSkill(skillInput.trim()); setSkillInput('');
                }
              }} />
          </div>
        </div>

        {/* Preferred Types */}
        <div className="form-group full-span" style={{ marginTop: 8 }}>
          <label className="form-label">Preferred Opportunity Types</label>
          <div className="checkbox-group">
            {OPP_TYPES.map(type => (
              <label key={type} className={`checkbox-pill ${(profile.preferredTypes || []).includes(type) ? 'selected' : ''}`}>
                <input type="checkbox" checked={(profile.preferredTypes || []).includes(type)} onChange={() => toggleType(type)} />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="form-group full-span" style={{ marginTop: 8 }}>
          <label className="form-label">Location Preference</label>
          <div className="radio-group">
            {['Remote', 'Local', 'Any'].map(loc => (
              <label key={loc} className="radio-item">
                <input type="radio" name="location" value={loc} checked={profile.location === loc}
                  onChange={() => update('location', loc)} />
                {loc}
              </label>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="form-group full-span" style={{ marginTop: 8 }}>
          <label className="form-label">Past Experience Snapshot</label>
          <textarea className="form-textarea" placeholder="Highlight key projects, hackathons, or relevant experience..."
            value={profile.experience} onChange={(e) => update('experience', e.target.value)} rows={3} />
        </div>
      </div>

      <div className="btn-group">
        <button className="btn btn-primary btn-lg" disabled={!canProceed}
          onClick={() => dispatch({ type: 'SET_STEP', payload: 1 })}>
          Continue to Emails
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>
        </button>
      </div>
      {!canProceed && (
        <p className="form-help" style={{ textAlign: 'right', marginTop: 8 }}>
          {!profile.name ? 'Name required • ' : ''}{!profile.program ? 'Program required • ' : ''}{!profile.cgpa ? 'CGPA required' : ''}
        </p>
      )}
    </div>
  );
}
