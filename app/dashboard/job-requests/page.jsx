"use client";
import { useState } from "react";

const C = {
  amber: '#E8820C', amberLight: '#FFF3E0', amberDark: '#B85A00',
  slate: '#1A1D23', slateLight: '#4A5068', muted: '#8A8FA8',
  surface: '#F7F6F2', white: '#FFFFFF',
  green: '#1B6E3A', greenLight: '#E6F4EC',
  border: 'rgba(26,29,35,0.1)', radius: '12px', radiusSm: '8px',
};

const INITIAL_JOBS = [
  { id: 1, title: 'Roofing Work – 3 Bedroom House',       client: 'Nimal Kumarasinghe', location: 'Kandy',       duration: '3 weeks', start: 'Jun 1, 2026',  budget: 'LKR 180,000', status: 'New' },
  { id: 2, title: 'Wall Plastering – Commercial Building', client: 'Chamari Perera',     location: 'Matale',      duration: '2 weeks', start: 'Jun 10, 2026', budget: 'LKR 95,000',  status: 'New' },
  { id: 3, title: 'Foundation Work – Residential Site',    client: 'Lasith Fernando',    location: 'Kandy',       duration: '4 weeks', start: 'Jun 20, 2026', budget: 'LKR 240,000', status: 'New' },
  { id: 4, title: 'Tiling – Bathroom & Kitchen',          client: 'Priya Senaratne',    location: 'Nuwaraeliya', duration: '1 week',  start: 'Jun 5, 2026',  budget: 'LKR 55,000',  status: 'New' },
];

function JobCard({ job, onAccept, onDecline }) {
  return (
    <div style={{ padding: '14px', border: `1px solid ${C.border}`, borderRadius: '10px', background: C.surface }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '0.5rem' }}>
        <div>
          <strong style={{ fontSize: '0.9rem', color: C.slate }}>{job.title}</strong>
          <div style={{ fontSize: '0.75rem', color: C.muted, marginTop: '2px' }}>{job.client} · {job.location}</div>
        </div>
        <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '2px 9px', borderRadius: '12px', background: C.amberLight, color: C.amberDark, alignSelf: 'flex-start' }}>
          New Request
        </span>
      </div>
      <div style={{ fontSize: '0.8rem', color: C.muted, marginBottom: '0.7rem' }}>
        Duration: {job.duration} · Start: {job.start} · Budget: {job.budget}
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button onClick={onAccept} style={{ fontSize: '0.78rem', fontWeight: 600, padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(27,110,58,0.3)', background: C.greenLight, color: C.green, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>✓ Accept</button>
        <button onClick={onDecline} style={{ fontSize: '0.78rem', fontWeight: 500, padding: '6px 12px', borderRadius: '6px', border: `1px solid ${C.border}`, background: 'none', color: C.slateLight, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>✗ Decline</button>
        <button style={{ fontSize: '0.78rem', fontWeight: 500, padding: '6px 12px', borderRadius: '6px', border: `1px solid ${C.border}`, background: 'none', color: C.slateLight, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>💬 Message</button>
        <button style={{ fontSize: '0.78rem', fontWeight: 500, padding: '6px 12px', borderRadius: '6px', border: `1px solid ${C.border}`, background: 'none', color: C.slateLight, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Request Advance</button>
      </div>
    </div>
  );
}

export default function JobRequestsPage() {
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const update = (id, status) => setJobs(prev => prev.map(j => j.id === id ? { ...j, status } : j));

  const newJobs      = jobs.filter(j => j.status === 'New');
  const acceptedJobs = jobs.filter(j => j.status === 'Accepted');
  const declinedJobs = jobs.filter(j => j.status === 'Declined');

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ marginBottom: '1.8rem' }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: C.slate }}>Job Requests</h2>
        <p style={{ fontSize: '0.82rem', color: C.muted, marginTop: '2px' }}>Accept or decline offers from property owners</p>
      </div>

      {newJobs.length > 0 && (
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: C.radius, padding: '1.5rem', marginBottom: '1.2rem' }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
            New Requests
            <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 9px', borderRadius: '12px', background: C.amberLight, color: C.amberDark, marginLeft: '8px' }}>{newJobs.length}</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {newJobs.map(j => <JobCard key={j.id} job={j} onAccept={() => update(j.id, 'Accepted')} onDecline={() => update(j.id, 'Declined')} />)}
          </div>
        </div>
      )}

      {acceptedJobs.length > 0 && (
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: C.radius, padding: '1.5rem', marginBottom: '1.2rem' }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: C.green }}>Accepted Jobs</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {acceptedJobs.map(j => (
              <div key={j.id} style={{ padding: '14px', border: '1px solid rgba(27,110,58,0.2)', borderRadius: '10px', background: C.greenLight }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: C.slate }}>{j.title}</div>
                <div style={{ fontSize: '0.75rem', color: C.slateLight, marginTop: '2px' }}>{j.client} · {j.location} · {j.budget}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '2px 9px', borderRadius: '12px', background: C.greenLight, color: C.green, border: '1px solid rgba(27,110,58,0.2)' }}>✓ Accepted</span>
                  <button onClick={() => update(j.id, 'New')} style={{ fontSize: '0.72rem', border: `1px solid ${C.border}`, background: 'none', padding: '3px 8px', borderRadius: '6px', cursor: 'pointer', color: C.muted }}>Undo</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {declinedJobs.length > 0 && (
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: C.radius, padding: '1.5rem' }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: C.muted }}>Declined</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {declinedJobs.map(j => (
              <div key={j.id} style={{ padding: '12px 14px', border: `1px solid ${C.border}`, borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: C.muted }}>{j.title}</div>
                  <div style={{ fontSize: '0.75rem', color: C.muted }}>{j.client} · {j.budget}</div>
                </div>
                <button onClick={() => update(j.id, 'New')} style={{ fontSize: '0.75rem', border: `1px solid ${C.border}`, background: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', color: C.slateLight }}>Undo</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {newJobs.length === 0 && acceptedJobs.length === 0 && declinedJobs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: C.muted, fontSize: '0.9rem' }}>No job requests right now.</div>
      )}
    </div>
  );
}
