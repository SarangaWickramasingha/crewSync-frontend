"use client";
import { useJobRequests, useRespondToJobRequest } from "@/src/hooks/provider/useProvider";

const C = {
  amber: '#E8820C', amberLight: '#FFF3E0', amberDark: '#B85A00',
  slate: '#1A1D23', slateLight: '#4A5068', muted: '#8A8FA8',
  surface: '#F7F6F2', white: '#FFFFFF',
  green: '#1B6E3A', greenLight: '#E6F4EC',
  border: 'rgba(26,29,35,0.1)', radius: '12px', radiusSm: '8px',
};

function JobCard({ job, onAccept, onDecline }) {
  return (
    <div style={{ padding: '14px', border: `1px solid ${C.border}`, borderRadius: '10px', background: C.surface }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '0.5rem' }}>
        <div>
          <strong style={{ fontSize: '0.9rem', fontWeight: 700, color: C.slate, letterSpacing: '-0.2px' }}>{job.title}</strong>
          <div style={{ fontSize: '0.75rem', color: C.muted, marginTop: '2px' }}>{job.client} · {job.location}</div>
        </div>
        <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 9px', borderRadius: '12px', background: C.amberLight, color: C.amberDark, alignSelf: 'flex-start', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
          New Request
        </span>
      </div>
      <div style={{ fontSize: '0.8rem', color: C.muted, marginBottom: '0.8rem' }}>
        Duration: {job.duration} · Start: {job.start}
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button onClick={onAccept} style={{ fontSize: '0.78rem', fontWeight: 600, padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(27,110,58,0.3)', background: C.greenLight, color: C.green, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>✓ Accept</button>
        <button onClick={onDecline} style={{ fontSize: '0.78rem', fontWeight: 500, padding: '6px 12px', borderRadius: '6px', border: `1px solid ${C.border}`, background: 'none', color: C.slateLight, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>✗ Decline</button>
      </div>
    </div>
  );
}

export default function JobRequestsPage() {
  const { data, isLoading } = useJobRequests();
  const respondMutation = useRespondToJobRequest();

  const jobs = data?.jobs ?? [];

  async function respond(id, action) {
    try {
      await respondMutation.mutateAsync({ id, action });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  if (isLoading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>Loading job requests…</div>;
  }

  const newJobs      = jobs.filter(j => j.status === 'New');
  const acceptedJobs = jobs.filter(j => j.status === 'Accepted');
  const declinedJobs = jobs.filter(j => j.status === 'Declined');

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ marginBottom: '1.8rem' }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: C.slate, letterSpacing: '-0.4px' }}>Job Requests</h2>
        <p style={{ fontSize: '0.82rem', color: C.muted, marginTop: '2px' }}>Accept or decline offers from property owners</p>
      </div>

      {newJobs.length > 0 && (
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: C.radius, padding: '1.5rem', marginBottom: '1.2rem' }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
            New Requests
            <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 9px', borderRadius: '12px', background: C.amberLight, color: C.amberDark, marginLeft: '8px' }}>{newJobs.length}</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {newJobs.map(j => (
              <JobCard
                key={j.id}
                job={j}
                onAccept={() => respond(j.id, 'accept')}
                onDecline={() => respond(j.id, 'decline')}
              />
            ))}
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
                <div style={{ fontSize: '0.75rem', color: C.slateLight, marginTop: '2px' }}>{j.client} · {j.location}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '2px 9px', borderRadius: '12px', background: C.greenLight, color: C.green, border: '1px solid rgba(27,110,58,0.2)' }}>✓ Accepted</span>
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
                  <div style={{ fontSize: '0.75rem', color: C.muted }}>{j.client}</div>
                </div>
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