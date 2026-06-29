"use client";

const C = {
  amber: '#E8820C', amberLight: '#FFF3E0', amberDark: '#B85A00',
  slate: '#1A1D23', slateLight: '#4A5068', muted: '#8A8FA8',
  surface: '#F7F6F2', white: '#FFFFFF',
  green: '#1B6E3A', greenLight: '#E6F4EC',
  blue: '#1A56A0', blueLight: '#E8F0FB',
  border: 'rgba(26,29,35,0.1)', radius: '12px', radiusSm: '8px',
};

const METRICS = [
  { val: 'LKR 380K', label: 'This Month',           extra: null },
  { val: 'LKR 140K', label: 'In Escrow',             extra: 'Held until completion', extraColor: C.blue },
  { val: 'LKR 2.1M', label: 'Total Earned (2026)',   extra: null },
];

const PAYMENTS = [
  {
    icon: '🏠', iconBg: '#E6F4EC', title: 'Foundation – Nimal\'s House',
    detail: 'Released Apr 2, 2026', amount: 'LKR 450,000',
    statusLabel: 'Received', statusBg: '#E6F4EC', statusColor: '#1B6E3A',
  },
  {
    icon: '🏗️', iconBg: '#FFF3E0', title: 'Roofing Advance – Current Project',
    detail: 'Advance May 5, 2026', amount: 'LKR 140,000',
    statusLabel: 'Advance Received', statusBg: '#E8F0FB', statusColor: '#1A56A0',
  },
  {
    icon: '💰', iconBg: '#E6F4EC', title: 'Wall Plastering – Chamari Site',
    detail: 'Released Mar 15, 2026', amount: 'LKR 90,000',
    statusLabel: 'Received', statusBg: '#E6F4EC', statusColor: '#1B6E3A',
  },
];

export default function EarningsPage() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: '1.8rem' }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: C.slate }}>Earnings</h2>
        <p style={{ fontSize: '0.82rem', color: C.muted, marginTop: '2px' }}>Track payments received and pending</p>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '1.8rem' }}>
        {METRICS.map((m, i) => (
          <div key={i} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: C.radiusSm, padding: '1rem 1.1rem' }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.6rem', fontWeight: 700, color: C.slate }}>{m.val}</div>
            <div style={{ fontSize: '0.73rem', color: C.muted, marginTop: '2px' }}>{m.label}</div>
            {m.extra && <div style={{ fontSize: '0.72rem', marginTop: '4px', color: m.extraColor || C.muted }}>{m.extra}</div>}
          </div>
        ))}
      </div>

      {/* Payment History */}
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: C.radius, padding: '1.5rem' }}>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Payment History</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {PAYMENTS.map((p, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < PAYMENTS.length - 1 ? `1px solid ${C.border}` : 'none', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: C.radiusSm, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0, background: p.iconBg }}>
                  {p.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{p.title}</div>
                  <div style={{ fontSize: '0.73rem', color: C.muted, marginTop: '1px' }}>{p.detail}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '1rem', fontWeight: 700 }}>{p.amount}</div>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: '10px', background: p.statusBg, color: p.statusColor }}>
                  {p.statusLabel}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
