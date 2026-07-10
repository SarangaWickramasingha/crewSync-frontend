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

export default function SupplierProfilePage() {
  const [checked, setChecked] = useState(['Sand','Cement','Stone / Rubble','Cement Blocks']);
  const [hasHardware, setHasHardware] = useState(true);
  const toggle = m => setChecked(p => p.includes(m) ? p.filter(x => x !== m) : [...p, m]);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.8rem', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: C.slate }}>My Profile</h2>
          <p style={{ fontSize: '0.82rem', color: C.muted, marginTop: '2px' }}>Update your store information and product categories</p>
        </div>
        <button onClick={() => alert('Profile saved!')}
          style={{ background: C.amber, color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
          Save Changes
        </button>
      </div>

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
    </div>
  );
}
