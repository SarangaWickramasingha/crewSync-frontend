"use client";
import { useState } from "react";

const C = {
  amber: '#E8820C', slate: '#1A1D23', slateLight: '#4A5068', muted: '#8A8FA8',
  surface: '#F7F6F2', white: '#FFFFFF', border: 'rgba(26,29,35,0.1)', radius: '12px', radiusSm: '8px',
};

const CONTACTS = [
  { id: 1, initials: 'NK', bg: '#FFF3E0', color: '#B85A00', name: 'Nimal Kumarasinghe', preview: 'Can you confirm delivery by tomorrow?', unread: 2 },
  { id: 2, initials: 'CP', bg: '#E8F0FB', color: '#1A56A0', name: 'Chamari Perera',     preview: 'I need 50 bags of cement.',           unread: 0 },
];

export default function ChatPage() {
  const [active, setActive] = useState(CONTACTS[0]);
  const [messages, setMessages] = useState({
    1: [
      { id: 1, mine: false, text: 'Hello! I need to order cement and sand.', ts: '10:20 AM' },
      { id: 2, mine: true,  text: 'Sure! How much do you need?',             ts: '10:22 AM' },
      { id: 3, mine: false, text: 'Can you confirm delivery by tomorrow?',   ts: '10:30 AM' },
    ],
    2: [
      { id: 1, mine: false, text: 'I need 50 bags of cement.',                ts: 'Yesterday' },
      { id: 2, mine: true,  text: "We have stock. I'll arrange delivery.",    ts: 'Yesterday' },
    ],
  });
  const [input, setInput] = useState('');
  const [lightbox, setLightbox] = useState(null);

  function timestamp() {
    const now = new Date();
    return `${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
  }

  function send() {
    const txt = input.trim();
    if (!txt) return;
    setMessages(prev => ({ ...prev, [active.id]: [...(prev[active.id] || []), { id: Date.now(), mine: true, text: txt, ts: timestamp() }] }));
    setInput('');
  }

  function handlePhotoSelect(files) {
    if (!files || !files.length) return;
    Array.from(files).forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = () => {
        setMessages(prev => ({ ...prev, [active.id]: [...(prev[active.id] || []), { id: Date.now() + i, mine: true, image: reader.result, ts: timestamp() }] }));
      };
      reader.readAsDataURL(file);
    });
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", display: 'flex', gap: '16px', height: 'calc(100vh - 140px)', minHeight: '400px' }}>
      <div style={{ width: '240px', flexShrink: 0, background: C.white, border: `1px solid ${C.border}`, borderRadius: C.radius, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1rem', borderBottom: `1px solid ${C.border}`, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.9rem' }}>Messages</div>
        {CONTACTS.map(c => (
          <div key={c.id} onClick={() => setActive(c)}
            style={{ padding: '12px 14px', cursor: 'pointer', borderBottom: `1px solid ${C.border}`, background: active.id === c.id ? C.surface : C.white, display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.7rem', flexShrink: 0, background: c.bg, color: c.color }}>{c.initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{c.name}</span>
                {c.unread > 0 && <span style={{ background: C.amber, color: '#fff', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.62rem', fontWeight: 700 }}>{c.unread}</span>}
              </div>
              <div style={{ fontSize: '0.72rem', color: C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.preview}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, background: C.white, border: `1px solid ${C.border}`, borderRadius: C.radius, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.2rem', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.7rem', background: active.bg, color: active.color }}>{active.initials}</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.9rem' }}>{active.name}</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {(messages[active.id] || []).map(msg => (
            <div key={msg.id} style={{ display: 'flex', justifyContent: msg.mine ? 'flex-end' : 'flex-start' }}>
              {msg.image ? (
                <div style={{ maxWidth: '75%', padding: '6px', borderRadius: '10px', background: msg.mine ? C.amber : C.surface }}>
                  <img src={msg.image} alt="Sent attachment" onClick={() => setLightbox(msg.image)}
                    style={{ display: 'block', maxWidth: '220px', maxHeight: '220px', width: '100%', borderRadius: '7px', cursor: 'pointer', objectFit: 'cover' }} />
                  <div style={{ fontSize: '0.65rem', marginTop: '4px', opacity: 0.7, textAlign: 'right', color: msg.mine ? '#fff' : C.slateLight }}>{msg.ts}</div>
                </div>
              ) : (
                <div style={{ maxWidth: '75%', padding: '8px 12px', borderRadius: '10px', fontSize: '0.82rem', lineHeight: 1.5,
                  background: msg.mine ? C.amber : C.surface, color: msg.mine ? '#fff' : C.slateLight }}>
                  {msg.text}
                  <div style={{ fontSize: '0.65rem', marginTop: '3px', opacity: 0.7, textAlign: 'right' }}>{msg.ts}</div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ padding: '12px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: '8px' }}>
          <input id="chat-photo-input" type="file" accept="image/*" multiple style={{ display: 'none' }}
            onChange={e => { handlePhotoSelect(e.target.files); e.target.value = ''; }} />
          <label htmlFor="chat-photo-input" title="Attach photos"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', flexShrink: 0, border: `1px solid ${C.border}`, borderRadius: C.radiusSm, cursor: 'pointer', color: C.slateLight, fontSize: '1.05rem' }}>
            📷
          </label>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Type a message…"
            style={{ flex: 1, border: `1px solid ${C.border}`, borderRadius: C.radiusSm, padding: '8px 12px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.83rem', outline: 'none', color: C.slate }} />
          <button onClick={send} style={{ background: C.amber, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: C.radiusSm, fontSize: '0.82rem', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}>Send</button>
        </div>
      </div>

      {lightbox && (
        <div onClick={() => setLightbox(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(26,29,35,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: '2rem', cursor: 'zoom-out' }}>
          <img src={lightbox} alt="Full size attachment" onClick={e => e.stopPropagation()}
            style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: '10px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }} />
          <button onClick={() => setLightbox(null)}
            style={{ position: 'absolute', top: '20px', right: '28px', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: '38px', height: '38px', borderRadius: '50%', fontSize: '1.2rem', cursor: 'pointer' }}>
            ×
          </button>
        </div>
      )}
    </div>
  );
}
