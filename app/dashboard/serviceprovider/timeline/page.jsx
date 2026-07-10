"use client";

const C = {
  amber: '#E8820C', amberLight: '#FFF3E0', amberDark: '#B85A00',
  slate: '#1A1D23', muted: '#8A8FA8', surface2: '#EEECEA', white: '#FFFFFF',
  green: '#1B6E3A', greenLight: '#E6F4EC',
  blue: '#1A56A0', blueLight: '#E8F0FB',
  border: 'rgba(26,29,35,0.1)', radius: '12px',
};

const PHASES = [
  { num: 1, name: 'Phase 1 – Foundation',      dates: 'Mar 1 – Mar 28, 2026', progress: 100, status: 'done',    label: 'Done' },
  { num: 2, name: 'Phase 2 – Structural Walls', dates: 'Apr 1 – Apr 30, 2026', progress: 100, status: 'done',    label: 'Done' },
  { num: 3, name: 'Phase 3 – Roofing',          dates: 'May 5 – May 25, 2026', progress: 55,  status: 'active',  label: 'Active · 55%' },
  { num: 4, name: 'Phase 4 – Plumbing',         dates: 'Jun 1 – Jun 30, 2026', progress: null, status: 'pending', label: 'Pending' },
  { num: 5, name: 'Phase 5 – Finishing',        dates: 'Jul 1 – Aug 15, 2026', progress: null, status: 'pending', label: 'Pending' },
];

const DOT  = { done: { background: '#E6F4EC', color: '#1B6E3A' }, active: { background: '#FFF3E0', color: '#B85A00' }, pending: { background: '#EEECEA', color: '#8A8FA8' } };
const PILL = { done: { background: '#E6F4EC', color: '#1B6E3A' }, active: { background: '#FFF3E0', color: '#B85A00' }, pending: { background: '#EEECEA', color: '#8A8FA8' } };
const BAR  = { done: '#1B6E3A', active: '#E8820C', pending: '#EEECEA' };

export default function TimelinePage() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ marginBottom: '1.8rem' }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: C.slate }}>Customer Project Timeline</h2>
        <p style={{ fontSize: '0.82rem', color: C.muted, marginTop: '2px' }}>View the full project timeline of your current job</p>
      </div>

      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: C.radius, padding: '1.5rem', marginBottom: '1.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '8px' }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1rem', fontWeight: 700 }}>House Build – Nimal Kumarasinghe, Kandy</h3>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '2px 9px', borderRadius: '12px', background: C.amberLight, color: C.amberDark }}>In Progress</span>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {PHASES.map((ph, i) => (
            <li key={ph.num} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '10px 0', borderBottom: i < PHASES.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0, marginTop: '2px', ...DOT[ph.status] }}>
                {ph.status === 'done' ? '✓' : ph.num}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{ph.name}</div>
                <div style={{ fontSize: '0.74rem', color: C.muted, marginTop: '2px' }}>{ph.dates}</div>
                {ph.progress !== null && (
                  <div style={{ height: '5px', background: C.surface2, borderRadius: '10px', marginTop: '6px' }}>
                    <div style={{ height: '100%', width: `${ph.progress}%`, background: BAR[ph.status], borderRadius: '10px' }} />
                  </div>
                )}
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: '10px', flexShrink: 0, marginTop: '4px', ...PILL[ph.status] }}>{ph.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ background: C.blueLight, border: '1px solid rgba(26,86,160,0.25)', borderRadius: C.radius, padding: '1rem 1.5rem' }}>
        <div style={{ fontSize: '0.85rem', color: C.blue }}>
          <strong>📌 Your assigned task:</strong> Phase 3 – Roofing. You are responsible for this phase.
        </div>
      </div>
    </div>
  );
}
