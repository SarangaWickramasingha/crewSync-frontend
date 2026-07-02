"use client";
import { useState } from "react";

const C = {
  amber: '#E8820C', amberLight: '#FFF3E0', amberDark: '#B85A00',
  slate: '#1A1D23', slateLight: '#4A5068', muted: '#8A8FA8',
  surface: '#F7F6F2', white: '#FFFFFF',
  green: '#1B6E3A', greenLight: '#E6F4EC',
  blue: '#1A56A0', blueLight: '#E8F0FB',
  border: 'rgba(26,29,35,0.1)', radius: '12px', radiusSm: '8px',
};

const INITIAL_TOPICS = [
  {
    id: 1,
    title: "Phase 3 – Roofing · Nimal's House, Kandy",
    status: 'Active',
    participants: 3,
    posts: [
      { id: 1, initials: 'NK', bg: '#FFF3E0', color: '#B85A00', name: 'Nimal Kumarasinghe', role: 'Property Owner', text: 'Just checking in on the roofing progress. Are we on schedule?', ts: 'Today, 10:30 AM' },
      { id: 2, initials: 'SK', bg: '#E6F4EC', color: '#1B6E3A', name: 'Sunil Karunaratne',  role: 'You',           text: "Yes, we've completed about 55% of the roofing. The remaining work should be done by May 22.", ts: 'Today, 10:38 AM' },
      { id: 3, initials: 'NK', bg: '#FFF3E0', color: '#B85A00', name: 'Nimal Kumarasinghe', role: 'Property Owner', text: 'Great to hear. Please share a few progress photos when you get a chance.', ts: 'Today, 10:42 AM' },
    ],
  },
  {
    id: 2,
    title: 'Foundation Work – Gampola Site',
    status: 'Upcoming',
    participants: 2,
    posts: [
      { id: 1, initials: 'LF', bg: '#E8F0FB', color: '#1A56A0', name: 'Lasith Fernando', role: 'Property Owner', text: 'Can we confirm the material delivery date before the crew arrives on site?', ts: 'Yesterday, 4:12 PM' },
      { id: 2, initials: 'SK', bg: '#E6F4EC', color: '#1B6E3A', name: 'Sunil Karunaratne', role: 'You', text: 'Materials are scheduled to arrive May 30, a day ahead of the crew.', ts: 'Yesterday, 4:40 PM' },
    ],
  },
];

function timeNow() {
  const now = new Date();
  const h = now.getHours() % 12 || 12, m = String(now.getMinutes()).padStart(2, '0');
  return `Today, ${h}:${m} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
}

export default function ForumPage() {
  const [topics, setTopics]       = useState(INITIAL_TOPICS);
  const [activeId, setActiveId]   = useState(INITIAL_TOPICS[0].id);
  const [input, setInput]         = useState('');

  const activeTopic = topics.find(t => t.id === activeId);

  function postReply() {
    const txt = input.trim();
    if (!txt) return;
    setTopics(prev => prev.map(t => t.id !== activeId ? t : {
      ...t,
      posts: [...t.posts, { id: Date.now(), initials: 'SK', bg: '#E6F4EC', color: '#1B6E3A', name: 'Sunil Karunaratne', role: 'You', text: txt, ts: timeNow() }],
    }));
    setInput('');
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ marginBottom: '1.6rem' }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: C.slate, letterSpacing: '-0.4px' }}>Project Forum</h2>
        <p style={{ fontSize: '0.82rem', color: C.muted, marginTop: '2px' }}>Discuss project progress and updates with property owners</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '16px', alignItems: 'start' }}>

        {/* Topic list */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: C.radius, overflow: 'hidden' }}>
          <div style={{ padding: '12px 14px', borderBottom: `1px solid ${C.border}`, fontSize: '0.7rem', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            Topics
          </div>
          {topics.map(t => {
            const active = t.id === activeId;
            const last = t.posts[t.posts.length - 1];
            return (
              <button
                key={t.id}
                onClick={() => setActiveId(t.id)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left', padding: '12px 14px',
                  border: 'none', borderBottom: `1px solid ${C.border}`, cursor: 'pointer',
                  background: active ? C.amberLight : 'transparent',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: active ? C.amberDark : C.slate, lineHeight: 1.35 }}>{t.title}</div>
                <div style={{ fontSize: '0.7rem', color: C.muted, marginTop: '4px' }}>{t.posts.length} posts · {t.participants} participants</div>
                <div style={{ fontSize: '0.7rem', color: C.muted, marginTop: '2px' }}>Last: {last.ts}</div>
                <span style={{
                  display: 'inline-block', marginTop: '6px', fontSize: '0.64rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px',
                  textTransform: 'uppercase', letterSpacing: '0.4px',
                  background: t.status === 'Active' ? C.greenLight : C.surface,
                  color: t.status === 'Active' ? C.green : C.muted,
                }}>
                  {t.status}
                </span>
              </button>
            );
          })}
        </div>

        {/* Thread view */}
        {activeTopic && (
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: C.radius, padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '8px', paddingBottom: '1rem', borderBottom: `1px solid ${C.border}` }}>
              <div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.3px' }}>{activeTopic.title}</h3>
                <div style={{ fontSize: '0.75rem', color: C.muted, marginTop: '3px' }}>{activeTopic.participants} participants · {activeTopic.posts.length} posts</div>
              </div>
              <span style={{
                fontSize: '0.7rem', fontWeight: 700, padding: '2px 9px', borderRadius: '12px',
                textTransform: 'uppercase', letterSpacing: '0.4px',
                background: activeTopic.status === 'Active' ? C.greenLight : C.surface,
                color: activeTopic.status === 'Active' ? C.green : C.muted,
              }}>
                {activeTopic.status}
              </span>
            </div>

            {/* Posts — uniform forum-style layout */}
            <div>
              {activeTopic.posts.map((p, i) => (
                <div key={p.id} style={{ display: 'flex', gap: '12px', padding: '14px 0', borderBottom: i < activeTopic.posts.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.72rem', flexShrink: 0, background: p.bg, color: p.color }}>
                    {p.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: C.slate }}>{p.name}</span>
                      <span style={{
                        fontSize: '0.65rem', fontWeight: 600, padding: '1px 7px', borderRadius: '8px',
                        background: p.role === 'You' ? C.greenLight : C.blueLight,
                        color: p.role === 'You' ? C.green : C.blue,
                      }}>
                        {p.role}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: C.muted, marginLeft: 'auto' }}>{p.ts}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: C.slateLight, lineHeight: 1.6, marginTop: '5px' }}>{p.text}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply box — forum style */}
            <div style={{ marginTop: '1.2rem', paddingTop: '1.2rem', borderTop: `1px solid ${C.border}` }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Post a Reply</div>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                rows={3}
                placeholder="Share an update or ask a question…"
                style={{ width: '100%', resize: 'vertical', border: `1px solid ${C.border}`, borderRadius: C.radiusSm, padding: '10px 12px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', outline: 'none', color: C.slate }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button onClick={postReply}
                  style={{ background: C.amber, color: '#fff', border: 'none', padding: '9px 20px', borderRadius: C.radiusSm, fontSize: '0.82rem', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}>
                  Post Reply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
