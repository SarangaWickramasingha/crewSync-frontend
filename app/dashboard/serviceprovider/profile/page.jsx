"use client";
import { useState } from "react";

const C = {
  amber: '#E8820C', amberLight: '#FFF3E0', amberDark: '#B85A00',
  slate: '#1A1D23', slateLight: '#4A5068', muted: '#8A8FA8',
  surface: '#F7F6F2', surface2: '#EEECEA', white: '#FFFFFF',
  green: '#1B6E3A', greenLight: '#E6F4EC',
  border: 'rgba(26,29,35,0.1)', radius: '12px', radiusSm: '8px',
};

const DISTRICTS = ['Kandy','Colombo','Gampaha','Matale','Badulla','Nuwaraeliya','Kurunegala','Galle','Matara','Jaffna'];
const SKILLS    = ['Mason','Carpenter','Electrician','Plumber','Painter','Tiler','Welder'];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1979 }, (_, i) => CURRENT_YEAR - i);

const inputStyle = {
  width: '100%', background: '#fff', border: '1px solid rgba(26,29,35,0.1)',
  borderRadius: '8px', padding: '9px 12px', fontSize: '0.85rem',
  fontFamily: "'DM Sans', sans-serif", color: '#1A1D23', outline: 'none', boxSizing: 'border-box',
};

function FormGroup({ label, children }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: C.slateLight, marginBottom: '5px' }}>{label}</label>
      {children}
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: C.radius, padding: '1.5rem' }}>
      <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>{title}</h3>
      {children}
    </div>
  );
}

export default function ServiceProviderProfilePage() {
  const [skills, setSkills] = useState(['Bricklaying','Plastering','Foundation Work','Roofing','Tiling']);
  const [newSkill, setNewSkill] = useState('');

  const [experiences, setExperiences] = useState([
    { id: 1, title: 'Mason – Self Employed', duration: '2011 – Present', desc: 'Residential and commercial construction across the Kandy region.' },
    { id: 2, title: 'Site Supervisor, Kandy Builders Ltd', duration: '2008 – 2011', desc: 'Supervised masonry crews on mid-size housing projects.' },
  ]);
  const [newExp, setNewExp] = useState({ title: '', duration: '', desc: '' });
  const [fromYear, setFromYear] = useState('');
  const [toYear, setToYear]     = useState('');

  function addSkill() {
    const s = newSkill.trim();
    if (s && !skills.includes(s)) { setSkills(p => [...p, s]); setNewSkill(''); }
  }

  function applyYearRange(from, to) {
    if (from && to) setNewExp(f => ({ ...f, duration: `${from} – ${to}` }));
  }

  function onFromYearChange(v) {
    setFromYear(v);
    applyYearRange(v, toYear);
  }

  function onToYearChange(v) {
    setToYear(v);
    applyYearRange(fromYear, v);
  }

  function addExperience() {
    if (!newExp.title.trim()) return;
    setExperiences(p => [...p, { id: Date.now(), title: newExp.title.trim(), duration: newExp.duration.trim(), desc: newExp.desc.trim() }]);
    setNewExp({ title: '', duration: '', desc: '' });
    setFromYear('');
    setToYear('');
  }

  function removeExperience(id) {
    setExperiences(p => p.filter(e => e.id !== id));
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.8rem', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: C.slate }}>My Profile</h2>
          <p style={{ fontSize: '0.82rem', color: C.muted, marginTop: '2px' }}>Showcase your skills to property owners</p>
        </div>
        <button onClick={() => alert('Profile saved!')}
          style={{ background: C.amber, color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
          Save Changes
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        <Card title="Personal Info">
          <FormGroup label="Full Name"><input style={inputStyle} defaultValue="Sunil Karunaratne" /></FormGroup>
          <FormGroup label="Primary Skill">
            <select style={inputStyle}>{SKILLS.map(s => <option key={s}>{s}</option>)}</select>
          </FormGroup>
          <FormGroup label="District">
            <select style={inputStyle}>{DISTRICTS.map(d => <option key={d}>{d}</option>)}</select>
          </FormGroup>
          <FormGroup label="Daily Rate (LKR)"><input style={inputStyle} type="number" defaultValue="3500" /></FormGroup>
          <FormGroup label="Bio">
            <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={3} defaultValue="Experienced mason with 15+ years of work in residential and commercial construction across the Kandy region." />
          </FormGroup>
          <hr style={{ border: 'none', borderTop: `1px solid ${C.border}`, margin: '1rem 0' }} />
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px', background: C.surface, borderRadius: C.radiusSm, border: `1px solid ${C.border}` }}>
            <input type="checkbox" id="outRegion" style={{ marginTop: '3px', width: '16px', height: '16px', accentColor: C.amber, cursor: 'pointer' }} />
            <div>
              <label htmlFor="outRegion" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Willing to work outside my region</label>
              <div style={{ fontSize: '0.75rem', color: C.muted, marginTop: '2px' }}>Your profile will be visible to property owners across Sri Lanka.</div>
            </div>
          </div>
        </Card>

        <Card title="Skills">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
            {skills.map(s => (
              <span key={s} onClick={() => setSkills(p => p.filter(x => x !== s))} title="Click to remove"
                style={{ fontSize: '0.7rem', fontWeight: 600, padding: '3px 10px', borderRadius: '12px', background: C.amberLight, color: C.amberDark, cursor: 'pointer' }}>
                {s} ×
              </span>
            ))}
          </div>
          <FormGroup label="Add Skill">
            <div style={{ display: 'flex', gap: '8px' }}>
              <input value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()}
                placeholder="e.g. Stonework" style={{ ...inputStyle, flex: 1 }} />
              <button onClick={addSkill} style={{ background: C.amber, color: '#fff', border: 'none', padding: '0 14px', borderRadius: C.radiusSm, fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                Add
              </button>
            </div>
          </FormGroup>
        </Card>

        <Card title="Work Experience">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.2rem' }}>
            {experiences.length === 0 && (
              <p style={{ fontSize: '0.8rem', color: C.muted }}>No experience added yet.</p>
            )}
            {experiences.map(exp => (
              <div key={exp.id} style={{ position: 'relative', padding: '10px 34px 10px 12px', background: C.surface, borderRadius: C.radiusSm, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: C.slate }}>{exp.title}</div>
                {exp.duration && <div style={{ fontSize: '0.72rem', color: C.amberDark, fontWeight: 600, marginTop: '2px' }}>{exp.duration}</div>}
                {exp.desc && <div style={{ fontSize: '0.78rem', color: C.slateLight, marginTop: '4px', lineHeight: 1.5 }}>{exp.desc}</div>}
                <button onClick={() => removeExperience(exp.id)} title="Remove"
                  style={{ position: 'absolute', top: '8px', right: '10px', background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: '0.9rem', lineHeight: 1 }}>
                  ×
                </button>
              </div>
            ))}
          </div>

          <div style={{ padding: '12px', background: C.surface, borderRadius: C.radiusSm, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: C.slateLight, marginBottom: '8px' }}>Add Experience</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input value={newExp.title} onChange={e => setNewExp(f => ({ ...f, title: e.target.value }))}
                placeholder="Role / Title (e.g. Site Supervisor, ABC Builders)" style={inputStyle} />

              <div>
                <div style={{ fontSize: '0.72rem', color: C.muted, marginBottom: '4px' }}>Pick years (optional) — or type the duration manually below</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select value={fromYear} onChange={e => onFromYearChange(e.target.value)} style={{ ...inputStyle, flex: 1 }}>
                    <option value="">From year</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  <select value={toYear} onChange={e => onToYearChange(e.target.value)} style={{ ...inputStyle, flex: 1 }}>
                    <option value="">To year</option>
                    <option value="Present">Present</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              <input value={newExp.duration} onChange={e => setNewExp(f => ({ ...f, duration: e.target.value }))}
                placeholder="Duration (e.g. 2018 – 2022, or 3 years)" style={inputStyle} />
              <textarea value={newExp.desc} onChange={e => setNewExp(f => ({ ...f, desc: e.target.value }))}
                placeholder="Brief description (optional)" rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
              <button onClick={addExperience}
                style={{ alignSelf: 'flex-start', background: C.amber, color: '#fff', border: 'none', padding: '7px 16px', borderRadius: C.radiusSm, fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                + Add Experience
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
