'use client';

const C = {
  amber: '#E8820C',
  amberLight: '#FFF3E0',
  amberDark: '#B85A00',
  slate: '#1A1D23',
  slateLight: '#4A5068',
  muted: '#8A8FA8',
  surface: '#F7F6F2',
  surface2: '#EEECEA',
  white: '#FFFFFF',
  green: '#1B6E3A',
  greenLight: '#E6F4EC',
  border: 'rgba(26,29,35,0.1)',
  radius: '12px',
  radiusSm: '8px',
};

const metrics = [
  { val: '38',      label: 'Products Listed',  change: null },
  { val: 'LKR 1.2M', label: 'Revenue (May)',   change: '↑ 18%', up: true },
  { val: '3',       label: 'Pending Orders',   change: null },
  { val: '4.8 ★',   label: 'Supplier Rating',  change: null },
];

export default function SupplierDashboard() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.8rem', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: C.slate }}>
            Malshan Hardware Store
          </h2>
          <p style={{ fontSize: '0.82rem', color: C.muted, marginTop: '2px' }}>Kandy District · Verified Supplier</p>
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '1.8rem' }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: C.radiusSm, padding: '1rem 1.1rem' }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.6rem', fontWeight: 700, color: C.slate }}>{m.val}</div>
            <div style={{ fontSize: '0.73rem', color: C.muted, marginTop: '2px' }}>{m.label}</div>
            {m.change && (
              <div style={{ fontSize: '0.72rem', marginTop: '4px', color: m.up ? C.green : '#C0392B' }}>{m.change}</div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: C.radius, padding: '1.5rem', marginBottom: '1.2rem' }}>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <a href="/dashboard/supplier/my-products" style={btnStyle(C.amber)}>+ Add Product</a>
          <a href="/dashboard/supplier/orders" style={btnStyle('#1A56A0')}>View Orders (3 new)</a>
          <a href="/dashboard/supplier/profile" style={btnOutlineStyle}>Edit Profile</a>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: C.radius, padding: '1.5rem' }}>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Recent Activity</h3>
        {[
          { icon: '📦', title: 'New order from Nimal Kumarasinghe', detail: 'Cement × 20 bags · LKR 57,000', time: '2 hours ago', pill: 'New', pillColor: C.amberDark, pillBg: C.amberLight },
          { icon: '✅', title: 'Order #ORD-039 delivered', detail: 'Sand × 2 cubes · LKR 24,000', time: 'Yesterday', pill: 'Delivered', pillColor: C.green, pillBg: C.greenLight },
          { icon: '⭐', title: 'New 5-star review received', detail: 'From Lasith Fernando', time: '2 days ago', pill: null },
        ].map((act, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < 2 ? `1px solid ${C.border}` : 'none' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: C.radiusSm, background: C.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
              {act.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{act.title}</div>
              <div style={{ fontSize: '0.73rem', color: C.muted, marginTop: '1px' }}>{act.detail}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
              {act.pill && (
                <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '2px 9px', borderRadius: '12px', background: act.pillBg, color: act.pillColor }}>{act.pill}</span>
              )}
              <span style={{ fontSize: '0.72rem', color: C.muted }}>{act.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function btnStyle(bg) {
  return {
    background: bg, color: '#fff', border: 'none', padding: '8px 18px',
    borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600,
    cursor: 'pointer', textDecoration: 'none', display: 'inline-block',
    fontFamily: "'DM Sans', sans-serif",
  };
}

const btnOutlineStyle = {
  background: 'transparent', color: '#4A5068', border: '1px solid rgba(26,29,35,0.15)',
  padding: '8px 18px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 500,
  cursor: 'pointer', textDecoration: 'none', display: 'inline-block',
  fontFamily: "'DM Sans', sans-serif",
};
