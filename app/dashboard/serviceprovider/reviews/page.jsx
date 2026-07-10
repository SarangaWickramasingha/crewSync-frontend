"use client";
import { useState } from "react";

const C = {
  amber: '#E8820C', amberLight: '#FFF3E0', amberDark: '#B85A00',
  slate: '#1A1D23', slateLight: '#4A5068', muted: '#8A8FA8',
  surface: '#F7F6F2', white: '#FFFFFF',
  green: '#1B6E3A', greenLight: '#E6F4EC',
  border: 'rgba(26,29,35,0.1)', radius: '12px', radiusSm: '8px',
};

const INITIAL_REVIEWS = [
  { id: 1, initials: 'NK', bg: '#FFF3E0', color: '#B85A00', name: 'Nimal Kumarasinghe', stars: 5, date: 'April 5, 2026',  text: '"Excellent work on the foundation. Very professional and completed everything on time. Highly recommended."', reply: 'Thank you Nimal! It was a pleasure working on your project. Looking forward to Phase 3!', reported: false },
  { id: 2, initials: 'PS', bg: '#E8F0FB', color: '#1A56A0', name: 'Priya Senaratne',    stars: 5, date: 'March 10, 2026', text: '"On time and great quality. Will hire again for future projects."', reply: null, reported: false },
];

export default function ReviewsPage() {
  const [reviews, setReviews]         = useState(INITIAL_REVIEWS);
  const [inputs, setInputs]           = useState({});
  const [reportOpen, setReportOpen]   = useState({});
  const [reportText, setReportText]   = useState({});
  const avgRating = (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length).toFixed(1);

  function submitReply(id) {
    const txt = (inputs[id] || '').trim();
    if (!txt) return;
    setReviews(prev => prev.map(r => r.id === id ? { ...r, reply: txt } : r));
    setInputs(prev => ({ ...prev, [id]: '' }));
  }

  function toggleReport(id) {
    setReportOpen(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function submitReport(id) {
    const txt = (reportText[id] || '').trim();
    if (!txt) return;
    setReviews(prev => prev.map(r => r.id === id ? { ...r, reported: true } : r));
    setReportText(prev => ({ ...prev, [id]: '' }));
    setReportOpen(prev => ({ ...prev, [id]: false }));
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.8rem', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: C.slate }}>Ratings and Reviews</h2>
          <p style={{ fontSize: '0.82rem', color: C.muted, marginTop: '2px' }}>Feedback from property owners — you can reply to each review</p>
        </div>
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: C.radiusSm, padding: '10px 16px', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.6rem', fontWeight: 700, color: C.slate }}>{avgRating} ★</div>
          <div style={{ fontSize: '0.72rem', color: C.muted, marginTop: '1px' }}>{reviews.length} reviews</div>
        </div>
      </div>

      {reviews.map(r => (
        <div key={r.id} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: C.radius, padding: '1.2rem', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.6rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.8rem', background: r.bg, color: r.color, flexShrink: 0 }}>{r.initials}</div>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{r.name}</div>
              <div style={{ color: C.amber, fontSize: '0.85rem' }}>{'★'.repeat(r.stars)}</div>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: '0.72rem', color: C.muted }}>{r.date}</div>
          </div>

          <div style={{ fontSize: '0.84rem', color: C.slateLight, lineHeight: 1.6 }}>{r.text}</div>

          {r.reply && (
            <div style={{ marginTop: '0.7rem', padding: '0.7rem 1rem', background: C.surface, borderLeft: `3px solid ${C.green}`, borderRadius: '0 8px 8px 0' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: C.green, marginBottom: '4px' }}>📷 Your Reply</div>
              <div style={{ fontSize: '0.82rem', color: C.slateLight, lineHeight: 1.5 }}>{r.reply}</div>
            </div>
          )}

          {r.reported && (
            <div style={{ marginTop: '0.7rem', padding: '0.5rem 0.8rem', background: '#FDECEC', borderRadius: '8px', fontSize: '0.75rem', color: '#B3261E', fontWeight: 600 }}>
              🚩 Reported to admin
            </div>
          )}

          <div style={{ marginTop: '0.6rem', display: 'flex', gap: '8px' }}>
            <input value={inputs[r.id] || ''} onChange={e => setInputs(prev => ({ ...prev, [r.id]: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && submitReply(r.id)}
              placeholder={r.reply ? 'Update your reply…' : 'Write a reply to this review…'}
              style={{ flex: 1, border: `1px solid ${C.border}`, borderRadius: C.radiusSm, padding: '8px 12px', fontSize: '0.8rem', fontFamily: "'DM Sans', sans-serif", outline: 'none', color: C.slate }} />
            <button onClick={() => submitReply(r.id)}
              style={{ background: C.amber, color: '#fff', border: 'none', padding: '8px 14px', borderRadius: C.radiusSm, fontSize: '0.78rem', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {r.reply ? 'Update' : 'Post Reply'}
            </button>
            {!r.reported && (
              <button onClick={() => toggleReport(r.id)}
                style={{ background: 'none', color: '#B3261E', border: '1px solid rgba(179,38,30,0.35)', padding: '8px 14px', borderRadius: C.radiusSm, fontSize: '0.78rem', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', whiteSpace: 'nowrap' }}>
                🚩 Report
              </button>
            )}
          </div>

          {reportOpen[r.id] && !r.reported && (
            <div style={{ marginTop: '0.6rem', padding: '0.8rem', background: '#FDECEC', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#B3261E', marginBottom: '6px' }}>Report this review to admin</div>
              <textarea value={reportText[r.id] || ''} onChange={e => setReportText(prev => ({ ...prev, [r.id]: e.target.value }))}
                placeholder="Explain why you're reporting this review…" rows={2}
                style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: C.radiusSm, padding: '8px 12px', fontSize: '0.8rem', fontFamily: "'DM Sans', sans-serif", outline: 'none', color: C.slate, resize: 'vertical' }} />
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <button onClick={() => submitReport(r.id)}
                  style={{ background: '#B3261E', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: C.radiusSm, fontSize: '0.76rem', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}>
                  Submit Report
                </button>
                <button onClick={() => toggleReport(r.id)}
                  style={{ background: 'none', color: C.muted, border: `1px solid ${C.border}`, padding: '7px 14px', borderRadius: C.radiusSm, fontSize: '0.76rem', fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
