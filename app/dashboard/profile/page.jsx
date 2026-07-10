"use client";

const C = {
  amber: '#E8820C', slate: '#1A1D23', slateLight: '#4A5068', muted: '#8A8FA8',
  surface: '#F7F6F2', white: '#FFFFFF', border: 'rgba(26,29,35,0.1)', radius: '12px', radiusSm: '8px',
};

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

export default function OwnerProfilePage() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.8rem', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: C.slate }}>My Profile</h2>
          <p style={{ fontSize: '0.82rem', color: C.muted, marginTop: '2px' }}>Manage your account details</p>
        </div>
        <button onClick={() => alert('Profile saved!')}
          style={{ background: C.amber, color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
          Save Changes
        </button>
      </div>

      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: C.radius, padding: '1.5rem', maxWidth: '480px' }}>
        <FormGroup label="Full Name"><input style={inputStyle} defaultValue="Nimal Kumarasinghe" /></FormGroup>
        <FormGroup label="Contact Number"><input style={inputStyle} type="tel" defaultValue="+94 77 000 0000" /></FormGroup>
        <FormGroup label="Email"><input style={inputStyle} type="email" defaultValue="owner@crewsync.lk" /></FormGroup>
      </div>
    </div>
  );
}
