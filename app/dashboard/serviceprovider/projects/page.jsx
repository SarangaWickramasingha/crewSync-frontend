"use client";

const C = {
  slate: '#1A1D23', muted: '#8A8FA8',
};

export default function ServiceProviderProjectsPage() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: C.slate, marginBottom: '0.4rem' }}>
        My Projects
      </h2>
      <p style={{ fontSize: '0.82rem', color: C.muted }}>Projects you're working on will show up here.</p>
    </div>
  );
}
