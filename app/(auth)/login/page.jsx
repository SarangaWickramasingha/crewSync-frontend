'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth, DEMO_USERS } from '@/context/AuthContext';

const ROLE_MAP = {
  'provider@crewsync.lk': DEMO_USERS.provider,
  'supplier@crewsync.lk': DEMO_USERS.supplier,
  'owner@crewsync.lk':    DEMO_USERS.owner,
};

const DEMO_BTNS = [
  { key: 'provider', label: 'Service Provider',  sub: 'provider@crewsync.lk', bg: '#E6F4EC', color: '#1B6E3A', icon: '🔨' },
  { key: 'supplier', label: 'Material Supplier',  sub: 'supplier@crewsync.lk', bg: '#FFF3E0', color: '#B85A00', icon: '📦' },
  { key: 'owner',    label: 'Property Owner',     sub: 'owner@crewsync.lk',    bg: '#E8F0FB', color: '#1A56A0', icon: '🏠' },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [remember, setRemember]         = useState(false);
  const [error, setError]               = useState('');
  const [mounted, setMounted]           = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  function handleSignIn(e) {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    if (!email.includes('@')) { setError('Please enter a valid email address.'); return; }

    const matched = ROLE_MAP[email.toLowerCase()];
    if (!matched) { setError('No account found for that email. Use a demo account below.'); return; }
    if (password.length < 1) { setError('Please enter your password.'); return; }

    login(matched);
    router.push('/dashboard');
  }

  function loginAsDemo(key) {
    login(DEMO_USERS[key]);
    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen flex">
      {/* Left image panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src="/images/login-bg.jpg" alt="Construction site" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1D23]/80 via-[#1A1D23]/50 to-transparent" />
        <div className="relative z-10 flex flex-col justify-between h-full p-10"
          style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(24px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
          <div />
          <div>
            <p className="text-white text-2xl font-bold leading-snug mb-3">Build smarter.<br />Connect faster.</p>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Sri Lanka's construction coordination platform — connecting property owners, service providers, and suppliers in one place.
            </p>
            <div className="flex gap-6 mt-6">
              {[{ val: '500+', lbl: 'Professionals' }, { val: '1,200+', lbl: 'Projects' }, { val: '25+', lbl: 'Districts' }].map(s => (
                <div key={s.lbl}>
                  <p className="text-[#E8820C] text-lg font-bold">{s.val}</p>
                  <p className="text-white/50 text-xs">{s.lbl}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center bg-[#F7F6F2] px-6 py-10">
        <div className="w-full max-w-[420px]"
          style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(32px)', transition: 'opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s' }}>

          <p className="lg:hidden font-climate text-[1.6rem] tracking-tight text-[#E8820C] mb-6 text-center">
            Crew<span className="text-[#1A1D23]">Sync</span>
          </p>

          <div className="rounded-2xl overflow-hidden bg-white border border-[rgba(26,29,35,0.1)] shadow-[0_4px_24px_rgba(26,29,35,0.10)]">
            {/* Header */}
            <div className="text-center px-8 py-7 relative overflow-hidden bg-[#1A1D23]">
              <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(232,130,12,0.15)_0%,transparent_65%)]" />
              <p className="font-climate text-[1.6rem] tracking-tight relative text-[#E8820C]">Crew<span className="text-white">Sync</span></p>
              <p className="text-[0.85rem] relative text-white/55 mt-0.5">Sign in to your account</p>
            </div>

            {/* Body */}
            <div className="px-8 py-7">
              {error && (
                <div className="mb-4 px-3 py-2 rounded-lg text-[0.82rem] bg-[#FDECEA] text-[#C0392B] border border-[#C0392B]">{error}</div>
              )}

              <form onSubmit={handleSignIn} noValidate>
                <div className="mb-4">
                  <label className="block mb-1.5 text-[0.78rem] font-semibold uppercase tracking-wide text-[#4A5068]">Email Address</label>
                  <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg text-[0.9rem] outline-none transition-all border text-[#1A1D23]"
                    onFocus={e => { e.target.style.borderColor = '#E8820C'; e.target.style.boxShadow = '0 0 0 3px rgba(232,130,12,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(26,29,35,0.1)'; e.target.style.boxShadow = 'none'; }} />
                </div>
                <div className="mb-4">
                  <label className="block mb-1.5 text-[0.78rem] font-semibold uppercase tracking-wide text-[#4A5068]">Password</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)}
                      className="w-full px-3 py-2.5 pr-10 rounded-lg text-[0.9rem] outline-none transition-all border text-[#1A1D23]"
                      onFocus={e => { e.target.style.borderColor = '#E8820C'; e.target.style.boxShadow = '0 0 0 3px rgba(232,130,12,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(26,29,35,0.1)'; e.target.style.boxShadow = 'none'; }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#8A8FA8] hover:text-[#1A1D23] transition-colors">
                      {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-5">
                  <label className="flex items-center gap-2 text-[0.82rem] cursor-pointer text-[#4A5068]">
                    <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="w-4 h-4 cursor-pointer" style={{ accentColor: '#E8820C' }} />
                    Remember me
                  </label>
                  <Link href="/forgot-password" className="text-[0.82rem] font-medium hover:underline text-[#E8820C]">Forgot password?</Link>
                </div>
                <button type="submit"
                  className="w-full py-3 rounded-lg font-semibold text-[0.95rem] text-white cursor-pointer transition-all mb-5 tracking-wide bg-[#E8820C] hover:bg-[#B85A00] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(232,130,12,0.3)]">
                  Sign In
                </button>
              </form>

              {/* Demo login section */}
              <div className="border-t border-[rgba(26,29,35,0.08)] pt-5">
                <p className="text-center text-[0.72rem] font-semibold uppercase tracking-wider text-[#8A8FA8] mb-3">Quick Demo Login</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {DEMO_BTNS.map(d => (
                    <button key={d.key} onClick={() => loginAsDemo(d.key)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${d.bg}`, background: d.bg, cursor: 'pointer', width: '100%', textAlign: 'left' }}>
                      <span style={{ fontSize: '1.1rem' }}>{d.icon}</span>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: d.color }}>{d.label}</div>
                        <div style={{ fontSize: '0.7rem', color: '#8A8FA8' }}>{d.sub}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-center text-[0.83rem] text-[#8A8FA8] mt-5">
                New here?{' '}
                <Link href="/register" className="font-semibold hover:underline text-[#E8820C]">Create an account →</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
