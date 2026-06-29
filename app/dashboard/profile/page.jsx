"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const C = {
  amber: '#E8820C', amberLight: '#FFF3E0', amberDark: '#B85A00',
  slate: '#1A1D23', slateLight: '#4A5068', muted: '#8A8FA8',
  surface: '#F7F6F2', surface2: '#EEECEA', white: '#FFFFFF',
  green: '#1B6E3A', greenLight: '#E6F4EC',
  border: 'rgba(26,29,35,0.1)', radius: '12px', radiusSm: '8px',
};

const DISTRICTS = ['Kandy','Colombo','Gampaha','Matale','Badulla','Nuwaraeliya','Kurunegala','Galle','Matara','Jaffna'];
const SKILLS    = ['Mason','Carpenter','Electrician','Plumber','Painter','Tiler','Welder'];
const MATERIALS = ['Sand','Cement','Timber','Stone / Rubble','Cement Blocks','Glass','Steel / Iron','Bricks'];

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

function SupplierProfile() {
  const [checked, setChecked] = useState(['Sand','Cement','Stone / Rubble','Cement Blocks']);
  const [hasHardware, setHasHardware] = useState(true);
  const toggle = m => setChecked(p => p.includes(m) ? p.filter(x => x !== m) : [...p, m]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
      <Card title="Store Information">
        <FormGroup label="Store / Business Name"><input style={inputStyle} defaultValue="Malshan Hardware" /></FormGroup>
        <FormGroup label="Owner Name"><input style={inputStyle} defaultValue="Malshan Perera" /></FormGroup>
        <FormGroup label="Contact Number"><input style={inputStyle} type="tel" defaultValue="+94 77 123 4567" /></FormGroup>
        <FormGroup label="Email"><input style={inputStyle} type="email" defaultValue="malshan@hardware.lk" /></FormGroup>
        <FormGroup label="District">
          <select style={inputStyle}>{DISTRICTS.map(d => <option key={d}>{d}</option>)}</select>
        </FormGroup>
        <FormGroup label="City / Town"><input style={inputStyle} defaultValue="Peradeniya, Kandy" /></FormGroup>
        <FormGroup label="Address"><textarea style={{ ...inputStyle, resize: 'vertical' }} rows={2} defaultValue="No. 45, Peradeniya Road, Kandy" /></FormGroup>
      </Card>

      <div>
        <Card title="Raw Materials Supplied">
          <p style={{ fontSize: '0.78rem', color: C.muted, marginBottom: '1rem' }}>Check the materials you supply so property owners can find you.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {MATERIALS.map(m => (
              <label key={m} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={checked.includes(m)} onChange={() => toggle(m)} style={{ width: '16px', height: '16px', accentColor: '#1A56A0' }} />
                {m}
              </label>
            ))}
          </div>
          <hr style={{ border: 'none', borderTop: `1px solid ${C.border}`, margin: '1.5rem 0' }} />
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1rem', fontWeight: 700, marginBottom: '0.6rem' }}>Hardware Store</h3>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px', background: C.surface, borderRadius: C.radiusSm, border: `1px solid ${C.border}` }}>
            <input type="checkbox" id="hw" checked={hasHardware} onChange={e => setHasHardware(e.target.checked)} style={{ marginTop: '3px', width: '16px', height: '16px', accentColor: '#1A56A0', cursor: 'pointer' }} />
            <div>
              <label htmlFor="hw" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>I also have a hardware store</label>
              <div style={{ fontSize: '0.75rem', color: C.muted, marginTop: '2px' }}>Property owners will know you carry tools, fittings, electrical and plumbing items.</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function ProviderProfile() {
  const [skills, setSkills] = useState(['Bricklaying','Plastering','Foundation Work','Roofing','Tiling']);
  const [newSkill, setNewSkill] = useState('');
  const [available, setAvailable] = useState(true);

  function addSkill() {
    const s = newSkill.trim();
    if (s && !skills.includes(s)) { setSkills(p => [...p, s]); setNewSkill(''); }
  }

  return (
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

      <Card title="Skills & Availability">
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
        <hr style={{ border: 'none', borderTop: `1px solid ${C.border}`, margin: '1rem 0' }} />
        <div style={{ fontSize: '0.83rem', fontWeight: 600, marginBottom: '0.5rem' }}>Availability</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setAvailable(true)}
            style={{ fontSize: '0.78rem', fontWeight: 600, padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              border: available ? '1px solid rgba(27,110,58,0.4)' : `1px solid ${C.border}`,
              background: available ? C.greenLight : 'none', color: available ? C.green : C.slateLight }}>
            ● Available Now
          </button>
          <button onClick={() => setAvailable(false)}
            style={{ fontSize: '0.78rem', fontWeight: 500, padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              border: !available ? '1px solid rgba(192,57,43,0.4)' : `1px solid ${C.border}`,
              background: !available ? '#FDECEA' : 'none', color: !available ? '#C0392B' : C.slateLight }}>
            Set as Busy
          </button>
        </div>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  const { isSupplier, isProvider } = useAuth();

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.8rem', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: C.slate }}>My Profile</h2>
          <p style={{ fontSize: '0.82rem', color: C.muted, marginTop: '2px' }}>
            {isSupplier ? 'Update your store information and product categories' : 'Showcase your skills to property owners'}
          </p>
        </div>
        <button onClick={() => alert('Profile saved!')}
          style={{ background: C.amber, color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
          Save Changes
        </button>
      </div>
      {isSupplier ? <SupplierProfile /> : <ProviderProfile />}
    </div>
  );
}
