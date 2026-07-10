"use client";
import { useState } from "react";

const C = {
  amber: '#E8820C', amberLight: '#FFF3E0', amberDark: '#B85A00',
  slate: '#1A1D23', slateLight: '#4A5068', muted: '#8A8FA8',
  surface: '#F7F6F2', white: '#FFFFFF',
  green: '#1B6E3A', greenLight: '#E6F4EC',
  border: 'rgba(26,29,35,0.1)', radius: '12px', radiusSm: '8px',
};

const INITIAL_POSTS = [
  { id: 1, initials: 'NK', bg: '#FFF3E0', color: '#B85A00', name: 'Nimal Kumarasinghe', role: 'Property Owner', text: 'Just checking in on the roofing progress. Are we on schedule?', ts: 'Today, 10:30 AM', mine: false },
  { id: 2, initials: 'SK', bg: '#E6F4EC', color: '#1B6E3A', name: 'Sunil Karunaratne',  role: 'You',           text: "Yes, we've completed about 55% of the roofing. The remaining work should be done by May 22.", ts: 'Today, 10:38 AM', mine: true },
];

export default function ForumPage() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [input, setInput] = useState('');

  function postComment() {
    const txt = input.trim();
    if (!txt) return;
    const now = new Date();
    const h = now.getHours(), m = String(now.getMinutes()).padStart(2, '0');
    setPosts(prev => [...prev, { id: Date.now(), initials: 'SK', bg: '#E6F4EC', color: '#1B6E3A', name: 'Sunil Karunaratne', role: 'You', text: txt, ts: `Today, ${h}:${m} ${h >= 12 ? 'PM' : 'AM'}`, mine: true }]);
    setInput('');
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ marginBottom: '1.8rem' }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: C.slate }}>Project Forum</h2>
        <p style={{ fontSize: '0.82rem', color: C.muted, marginTop: '2px' }}>Communicate with property owners on active projects</p>
      </div>

      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: C.radius, padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1rem', fontWeight: 700 }}>🏗️ Phase 3 – Roofing · Nimal&apos;s House, Kandy</h3>
            <div style={{ fontSize: '0.75rem', color: C.muted, marginTop: '2px' }}>3 participants · Last activity: Today 10:42 AM</div>
          </div>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '2px 9px', borderRadius: '12px', background: C.amberLight, color: C.amberDark }}>Active</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1rem' }}>
          {posts.map(p => (
            <div key={p.id} style={{ display: 'flex', gap: '10px', justifyContent: 'flex-start' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.72rem', flexShrink: 0, background: p.bg, color: p.color }}>
                {p.initials}
              </div>
              <div style={{ background: p.mine ? C.greenLight : C.surface, borderRadius: '10px', padding: '10px 12px', maxWidth: '70%' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, marginBottom: '3px' }}>
                  {p.name} <span style={{ fontWeight: 400, color: C.muted }}>· {p.role}</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: C.slateLight, lineHeight: 1.5 }}>{p.text}</div>
                <div style={{ fontSize: '0.68rem', color: C.muted, marginTop: '4px' }}>{p.ts}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: `1px solid ${C.border}` }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && postComment()}
            placeholder="Add a comment to this project…"
            style={{ flex: 1, border: `1px solid ${C.border}`, borderRadius: C.radiusSm, padding: '8px 12px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.83rem', outline: 'none', color: C.slate }} />
          <button onClick={postComment}
            style={{ background: C.green, color: '#fff', border: 'none', padding: '8px 18px', borderRadius: C.radiusSm, fontSize: '0.82rem', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
