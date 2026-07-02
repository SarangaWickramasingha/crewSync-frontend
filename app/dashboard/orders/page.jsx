"use client";
import { useState } from "react";

const C = {
  amber: '#E8820C', amberLight: '#FFF3E0', amberDark: '#B85A00',
  slate: '#1A1D23', slateLight: '#4A5068', muted: '#8A8FA8',
  surface: '#F7F6F2', surface2: '#EEECEA', white: '#FFFFFF',
  green: '#1B6E3A', greenLight: '#E6F4EC',
  blue: '#1A56A0', blueLight: '#E8F0FB',
  red: '#C0392B', redLight: '#FDECEA',
  border: 'rgba(26,29,35,0.1)', radius: '12px', radiusSm: '8px',
};

const STATUS_META = {
  New:        { bg: C.amberLight, color: C.amberDark, icon: '🆕' },
  Processing: { bg: C.blueLight,  color: C.blue,       icon: '⏳' },
  Delivered:  { bg: C.greenLight, color: C.green,      icon: '✅' },
};

const INITIAL_ORDERS = [
  { id: '#ORD-041', customer: 'Nimal Kumarasinghe', items: 'Cement × 20 bags', amount: 'LKR 57,000', status: 'New' },
  { id: '#ORD-040', customer: 'Chamari Perera',      items: 'Steel Rod × 50m', amount: 'LKR 44,500', status: 'Processing' },
  { id: '#ORD-039', customer: 'Lasith Fernando',     items: 'Sand × 2 cubes',  amount: 'LKR 24,000', status: 'Delivered' },
];

const initialsOf = (name) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

export default function SupplierOrdersPage() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  const handleAccept = (id) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Processing' } : o));
  const handleReject = (id) => setOrders(prev => prev.filter(o => o.id !== id));

  const counts = {
    New: orders.filter(o => o.status === 'New').length,
    Processing: orders.filter(o => o.status === 'Processing').length,
    Delivered: orders.filter(o => o.status === 'Delivered').length,
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Page Header */}
      <div style={{ marginBottom: '1.6rem' }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: C.slate, letterSpacing: '-0.4px' }}>Orders</h2>
        <p style={{ fontSize: '0.82rem', color: C.muted, marginTop: '2px' }}>Manage incoming material orders</p>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '1.6rem' }}>
        {[
          { label: 'New Orders',  val: counts.New,        meta: STATUS_META.New },
          { label: 'Processing',  val: counts.Processing, meta: STATUS_META.Processing },
          { label: 'Delivered',   val: counts.Delivered,  meta: STATUS_META.Delivered },
        ].map(s => (
          <div key={s.label} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: C.radiusSm, padding: '1rem 1.1rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: s.meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.05rem', flexShrink: 0 }}>
              {s.meta.icon}
            </div>
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.4rem', fontWeight: 700, color: C.slate, lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: '0.72rem', color: C.muted, marginTop: '3px' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Order List */}
      {orders.length === 0 ? (
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: C.radius, padding: '3rem', textAlign: 'center', color: C.muted, fontSize: '0.9rem' }}>
          No orders yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {orders.map(order => {
            const meta = STATUS_META[order.status];
            return (
              <div key={order.id} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: C.radius, padding: '1.1rem 1.3rem', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>

                {/* Customer avatar */}
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: C.surface2, color: C.slateLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>
                  {initialsOf(order.customer)}
                </div>

                {/* Main info */}
                <div style={{ flex: '1 1 220px', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: C.slate }}>{order.customer}</span>
                    <span style={{ fontSize: '0.72rem', color: C.muted }}>{order.id}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: C.muted, marginTop: '2px' }}>{order.items}</div>
                </div>

                {/* Amount */}
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.95rem', fontWeight: 700, color: C.slate, flexShrink: 0 }}>
                  {order.amount}
                </div>

                {/* Status pill */}
                <span style={{
                  fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: '12px',
                  background: meta.bg, color: meta.color, flexShrink: 0,
                  textTransform: 'uppercase', letterSpacing: '0.4px',
                }}>
                  {order.status}
                </span>

                {/* Actions */}
                <div style={{ flexShrink: 0, minWidth: '150px', textAlign: 'right' }}>
                  {order.status === 'New' && (
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleAccept(order.id)}
                        style={{ fontSize: '0.76rem', fontWeight: 600, padding: '6px 12px', borderRadius: '6px', border: `1px solid rgba(27,110,58,0.3)`, background: C.greenLight, color: C.green, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                        Accept
                      </button>
                      <button onClick={() => handleReject(order.id)}
                        style={{ fontSize: '0.76rem', fontWeight: 500, padding: '6px 12px', borderRadius: '6px', border: `1px solid ${C.border}`, background: 'none', color: C.slateLight, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                        Reject
                      </button>
                    </div>
                  )}
                  {order.status === 'Processing' && (
                    <span style={{ fontSize: '0.76rem', color: C.muted, fontWeight: 500 }}>Awaiting delivery</span>
                  )}
                  {order.status === 'Delivered' && (
                    <span style={{ fontSize: '0.76rem', color: C.muted, fontWeight: 500 }}>Completed</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
