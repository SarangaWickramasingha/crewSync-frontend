'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth, DEMO_USERS } from '@/context/AuthContext';

const C = {
  amber: '#E8820C', amberHover: '#B85A00',
  slate: '#1A1D23', slateLight: '#4A5068',
  muted: '#8A8FA8', surface: '#F7F6F2',
  border: 'rgba(26,29,35,0.12)',
  green: '#1B6E3A', greenLight: '#E6F4EC',
  orange: '#B85A00', orangeLight: '#FFF3E0',
  blue: '#1A56A0', blueLight: '#E8F0FB',
};

const ROLE_EMAILS = {
  'provider@crewsync.lk': DEMO_USERS.provider,
  'supplier@crewsync.lk': DEMO_USERS.supplier,
  'owner@crewsync.lk':    DEMO_USERS.owner,
};

const inputStyle = {
  width: '100%', padding: '10px 12px', border: '1px solid rgba(26,29,35,0.12)',
  borderRadius: '8px', fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif",
  color: '#1A1D23', background: '#fff', outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPw, setShowPw]     = useState(false);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [mounted, setMounted]   = useState(false);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  function handleSignIn(e) {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    const user = ROLE_EMAILS[email.toLowerCase()];
    if (!user) { setError('Email not found. Please check your email and try again.'); return; }
    login(user);
    router.push('/dashboard');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── LEFT: Image Panel ── */}
      <div className="login-left-panel" style={{
        flex: '0 0 50%', position: 'relative', overflow: 'hidden',
        flexDirection: 'column', justifyContent: 'flex-end',
      }}>
        <img src="/assets/images/login-bg.jpg" alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(26,29,35,0.88) 0%, rgba(26,29,35,0.55) 55%, rgba(26,29,35,0.2) 100%)' }} />
        {/* Content */}
        <div style={{
          position: 'relative', zIndex: 1, padding: '2.5rem 2.8rem',
          opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}>
          <div style={{ fontFamily: "'Climate Crisis', 'Syne', cursive", fontSize: '1.8rem', color: '#E8820C', marginBottom: '1rem', letterSpacing: '-0.5px' }}>
            Crew<span style={{ color: '#fff' }}>Sync</span>
          </div>
          <p style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.35, fontFamily: "'Syne', sans-serif", marginBottom: '0.8rem' }}>
            Build smarter.<br />Connect faster.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', lineHeight: 1.65, maxWidth: '300px', marginBottom: '2rem' }}>
            Sri Lanka's construction coordination platform — connecting property owners, service providers, and suppliers in one place.
          </p>
          <div style={{ display: 'flex', gap: '2rem' }}>
            {[{ val: '500+', lbl: 'Professionals' }, { val: '1,200+', lbl: 'Projects' }, { val: '25+', lbl: 'Districts' }].map(s => (
              <div key={s.lbl}>
                <div style={{ color: '#E8820C', fontSize: '1.15rem', fontWeight: 700 }}>{s.val}</div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', marginTop: '1px' }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: Form Panel ── */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: C.surface, padding: '2rem 1.5rem',
      }}>
        <div style={{
          width: '100%', maxWidth: '420px',
          opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(28px)',
          transition: 'opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s',
        }}>
          <div style={{ background: '#fff', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 4px 36px rgba(26,29,35,0.13)', border: `1px solid ${C.border}` }}>

            {/* Card header */}
            <div style={{ background: C.slate, padding: '1.8rem 2rem 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,130,12,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />
              <div style={{ fontFamily: "'Climate Crisis', 'Syne', cursive", fontSize: '1.75rem', color: '#E8820C', position: 'relative', letterSpacing: '-0.5px' }}>
                Crew<span style={{ color: '#fff' }}>Sync</span>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.48)', fontSize: '0.82rem', marginTop: '4px', position: 'relative' }}>Sign in to your account</div>
            </div>

            {/* Card body */}
            <div style={{ padding: '1.75rem 2rem 2rem' }}>
              {error && (
                <div style={{ marginBottom: '1rem', padding: '10px 14px', borderRadius: '8px', background: '#FDECEA', color: '#C0392B', border: '1px solid rgba(192,57,43,0.25)', fontSize: '0.82rem' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSignIn} noValidate>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: C.slateLight, marginBottom: '6px' }}>Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = C.amber; e.target.style.boxShadow = '0 0 0 3px rgba(232,130,12,0.12)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(26,29,35,0.12)'; e.target.style.boxShadow = 'none'; }} />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: C.slateLight, marginBottom: '6px' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" style={{ ...inputStyle, paddingRight: '42px' }}
                      onFocus={e => { e.target.style.borderColor = C.amber; e.target.style.boxShadow = '0 0 0 3px rgba(232,130,12,0.12)'; }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(26,29,35,0.12)'; e.target.style.boxShadow = 'none'; }} />
                    <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.muted, display: 'flex', padding: 0 }}>
                      {showPw ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.3rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.82rem', color: C.slateLight, cursor: 'pointer' }}>
                    <input type="checkbox" style={{ width: '15px', height: '15px', accentColor: C.amber, cursor: 'pointer' }} />
                    Remember me
                  </label>
                  <Link href="/forgot-password" style={{ fontSize: '0.82rem', color: C.amber, fontWeight: 500, textDecoration: 'none' }}>Forgot password?</Link>
                </div>

                <button type="submit" style={{
                  width: '100%', padding: '11px', borderRadius: '8px', border: 'none',
                  background: C.amber, color: '#fff', fontSize: '0.95rem', fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', letterSpacing: '0.02em',
                  transition: 'all 0.2s', marginBottom: '1.3rem',
                }}
                  onMouseOver={e => { e.currentTarget.style.background = C.amberHover; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 5px 16px rgba(232,130,12,0.35)'; }}
                  onMouseOut={e => { e.currentTarget.style.background = C.amber; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                  Sign In
                </button>
              </form>

              <p style={{ textAlign: 'center', fontSize: '0.82rem', color: C.muted, marginTop: '0.4rem' }}>
                New here?{' '}
                <Link href="/register" style={{ color: C.amber, fontWeight: 600, textDecoration: 'none' }}>Create an account →</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive: hide left panel on small screens */}
      <style>{`
        .login-left-panel { display: none; }
        @media (min-width: 1024px) { .login-left-panel { display: flex; } }
      `}</style>
    </div>
  );
}
