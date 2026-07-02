'use client';
import { useState } from 'react';
import Link from 'next/link';

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
  { val: '47',  label: 'Total Reviews',    change: '★ 4.9 avg', up: true },
  { val: '4',   label: 'Active Projects',  change: null },
  { val: '156', label: 'Jobs Completed',   change: null },
];

const currentWork = [
  {
    num: 1, name: 'Roofing – Nimal\'s House, Kandy',
    dates: 'May 5 – May 25, 2026', progress: 55, status: 'Active',
    dotClass: 'active',
  },
  {
    num: 2, name: 'Foundation Work – Gampola Site',
    dates: 'Starts Jun 1, 2026', progress: null, status: 'Upcoming',
    dotClass: 'pending',
  },
];

const recentReviews = [
  { name: 'Nimal K.',  stars: 5, text: '"Excellent work on the foundation. Very professional."' },
  { name: 'Priya S.',  stars: 5, text: '"On time and great quality. Will hire again."' },
];

export default function ProviderDashboard() {
  const [available, setAvailable] = useState(true);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.8rem', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: C.slate }}>
            Welcome, Sunil 👋
          </h2>
          <p style={{ fontSize: '0.82rem', color: C.muted, marginTop: '2px' }}>You have 4 new job requests this week</p>
        </div>
        <button
          onClick={() => setAvailable(a => !a)}
          title="Click to toggle your availability"
          style={{
            fontSize: '0.8rem', fontWeight: 600, padding: '6px 12px', borderRadius: '12px',
            border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            background: available ? C.greenLight : C.surface2,
            color: available ? C.green : C.slateLight,
          }}
        >
          ● {available ? 'Available for Work' : 'Not Available for Work'}
        </button>
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

      {/* Two-column: Current Work + Recent Reviews */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>

        {/* Current Work */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: C.radius, padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1rem', fontWeight: 700 }}>Current Work</h3>
            <Link href="/dashboard/timeline" style={{ fontSize: '0.78rem', color: C.amberDark, textDecoration: 'none', fontWeight: 500 }}>
              View Timeline →
            </Link>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {currentWork.map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '10px 0', borderBottom: i < currentWork.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', fontWeight: 700, marginTop: '2px',
                  background: item.dotClass === 'active' ? C.amberLight : C.surface2,
                  color: item.dotClass === 'active' ? C.amberDark : C.muted,
                }}>
                  {item.num}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{item.name}</div>
                  <div style={{ fontSize: '0.74rem', color: C.muted, marginTop: '2px' }}>{item.dates}</div>
                  {item.progress !== null && (
                    <div style={{ height: '5px', background: C.surface2, borderRadius: '10px', marginTop: '6px' }}>
                      <div style={{ height: '100%', width: `${item.progress}%`, background: C.amber, borderRadius: '10px' }} />
                    </div>
                  )}
                </div>
                <span style={{
                  fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: '10px', flexShrink: 0, marginTop: '4px',
                  background: item.dotClass === 'active' ? C.amberLight : C.surface2,
                  color: item.dotClass === 'active' ? C.amberDark : C.muted,
                }}>
                  {item.status}
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/dashboard/job-requests"
            style={{ display: 'block', marginTop: '1rem', textAlign: 'center', background: C.amber, color: '#fff', padding: '8px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' }}
          >
            View Job Requests (4)
          </Link>
        </div>

        {/* Recent Reviews */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: C.radius, padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1rem', fontWeight: 700 }}>Recent Reviews</h3>
            <Link href="/dashboard/reviews" style={{ fontSize: '0.78rem', color: C.amberDark, textDecoration: 'none', fontWeight: 500 }}>
              All Reviews →
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentReviews.map((r, i) => (
              <div key={i}>
                <div style={{ fontSize: '0.83rem', fontWeight: 600 }}>
                  {r.name} <span style={{ color: C.amber }}>{'★'.repeat(r.stars)}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: C.muted, marginTop: '2px', lineHeight: 1.5 }}>{r.text}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1.2rem', padding: '12px', background: C.greenLight, borderRadius: '8px', border: `1px solid rgba(27,110,58,0.2)` }}>
            <div style={{ fontSize: '0.8rem', color: C.green, fontWeight: 600 }}>★ 4.9 Average Rating</div>
            <div style={{ fontSize: '0.73rem', color: C.green, marginTop: '2px' }}>Based on 47 verified reviews</div>
          </div>
        </div>
      </div>
    </div>
  );
}
