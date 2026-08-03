"use client";
import { useState } from "react";

const C = {
  amber: '#E8820C', amberLight: '#FFF3E0', amberDark: '#B85A00',
  slate: '#1A1D23', slateLight: '#4A5068', muted: '#8A8FA8',
  surface: '#F7F6F2', surface2: '#EEECEA', white: '#FFFFFF',
  green: '#1B6E3A', greenLight: '#E6F4EC',
  border: 'rgba(26,29,35,0.1)', radius: '12px', radiusSm: '8px',
};

const DISTRICTS = ['Kandy', 'Colombo', 'Gampaha', 'Matale', 'Badulla', 'Nuwaraeliya', 'Kurunegala', 'Galle', 'Matara', 'Jaffna'];

const inputStyle = {
  width: '100%', background: '#fff', border: '1px solid rgba(26,29,35,0.1)',
  borderRadius: '8px', padding: '9px 12px', fontSize: '0.85rem',
  fontFamily: "'DM Sans', sans-serif", color: '#1A1D23', outline: 'none', boxSizing: 'border-box',
};

const btnStyle = {
  background: C.amber, color: '#fff', border: 'none',
  padding: '10px 20px', borderRadius: '8px', fontSize: '0.85rem',
  fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
  width: '100%', marginTop: '0.5rem',
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
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: C.radius, padding: '1.5rem', marginBottom: '1rem' }}>
      <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>{title}</h3>
      {children}
    </div>
  );
}

export default function SupplierProfilePage() {
  const [personalInfo, setPersonalInfo] = useState({
    firstName: 'Malshan',
    lastName: 'Perera',
    contactNumber: '+94 77 123 4567',
    district: 'Kandy',
  });

  const [businessInfo, setBusinessInfo] = useState({
    businessName: 'Malshan Hardware',
    businessAddress: 'No. 45, Peradeniya Road, Kandy',
  });

  const [hasHardware, setHasHardware] = useState(true);
  const [hwStore, setHwStore] = useState({
    storeName: 'Malshan Hardware Store',
    brNumber: 'BR-102938',
    address: 'No. 45, Peradeniya Road, Kandy',
  });

  const updatePersonal = (e) => {
    e.preventDefault();
    alert('Personal Information updated!');
  };

  const updateBusiness = (e) => {
    e.preventDefault();
    alert('Business Information updated!');
  };

  const updateHardware = (e) => {
    e.preventDefault();
    alert('Hardware Store Information updated!');
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}


      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Personal Information */}
          <form onSubmit={updatePersonal}>
            <Card title="Personal Information">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <FormGroup label="First Name">
                  <input
                    style={inputStyle}
                    value={personalInfo.firstName}
                    onChange={e => setPersonalInfo(p => ({ ...p, firstName: e.target.value }))}
                  />
                </FormGroup>
                <FormGroup label="Last Name">
                  <input
                    style={inputStyle}
                    value={personalInfo.lastName}
                    onChange={e => setPersonalInfo(p => ({ ...p, lastName: e.target.value }))}
                  />
                </FormGroup>
              </div>
              <FormGroup label="Contact Number">
                <input
                  style={inputStyle}
                  type="tel"
                  value={personalInfo.contactNumber}
                  onChange={e => setPersonalInfo(p => ({ ...p, contactNumber: e.target.value }))}
                />
              </FormGroup>
              <FormGroup label="District">
                <select
                  style={inputStyle}
                  value={personalInfo.district}
                  onChange={e => setPersonalInfo(p => ({ ...p, district: e.target.value }))}
                >
                  {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </FormGroup>
              <button type="submit" style={btnStyle}>
                Update Personal Info
              </button>
            </Card>
          </form>

          {/* Business Information */}
          <form onSubmit={updateBusiness}>
            <Card title="Business Information">
              <FormGroup label="Business Name">
                <input
                  style={inputStyle}
                  value={businessInfo.businessName}
                  onChange={e => setBusinessInfo(b => ({ ...b, businessName: e.target.value }))}
                />
              </FormGroup>
              <FormGroup label="Business Address">
                <textarea
                  style={{ ...inputStyle, resize: 'vertical' }}
                  rows={2}
                  value={businessInfo.businessAddress}
                  onChange={e => setBusinessInfo(b => ({ ...b, businessAddress: e.target.value }))}
                />
              </FormGroup>
              <button type="submit" style={btnStyle}>
                Update Business Info
              </button>
            </Card>
          </form>
        </div>

        <div>
          {/* Hardware Store */}
          <Card title="Hardware Store">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px', background: C.surface, borderRadius: C.radiusSm, border: `1px solid ${C.border}` }}>
              <input
                type="checkbox"
                id="hw"
                checked={hasHardware}
                onChange={e => setHasHardware(e.target.checked)}
                style={{ marginTop: '3px', width: '16px', height: '16px', accentColor: '#1A56A0', cursor: 'pointer' }}
              />
              <div>
                <label htmlFor="hw" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>I also have a hardware store</label>
                <div style={{ fontSize: '0.75rem', color: C.muted, marginTop: '2px' }}>Property owners will know you carry tools, fittings, electrical and plumbing items.</div>
              </div>
            </div>

            {hasHardware && (
              <form onSubmit={updateHardware} style={{ marginTop: '1.2rem', paddingTop: '1.2rem', borderTop: `1px solid ${C.border}` }}>
                <FormGroup label="Store Name">
                  <input
                    style={inputStyle}
                    value={hwStore.storeName}
                    onChange={e => setHwStore(s => ({ ...s, storeName: e.target.value }))}
                    placeholder="e.g. Malshan Hardware Store"
                  />
                </FormGroup>
                <FormGroup label="BR Number">
                  <input
                    style={inputStyle}
                    value={hwStore.brNumber}
                    onChange={e => setHwStore(s => ({ ...s, brNumber: e.target.value }))}
                    placeholder="e.g. BR-102938"
                  />
                </FormGroup>
                <FormGroup label="Address">
                  <textarea
                    style={{ ...inputStyle, resize: 'vertical' }}
                    rows={2}
                    value={hwStore.address}
                    onChange={e => setHwStore(s => ({ ...s, address: e.target.value }))}
                    placeholder="e.g. No. 45, Peradeniya Road, Kandy"
                  />
                </FormGroup>
                <button type="submit" style={btnStyle}>
                  Update Hardware Info
                </button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
