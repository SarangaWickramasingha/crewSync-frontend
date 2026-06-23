'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RolePicker from './RolePicker';
import StepCredentials from './register-steps/StepCredentials';
import StepPersonalInfo from './register-steps/StepPersonalInfo';
import StepOwnerDetails from './register-steps/StepOwnerDetails';
import StepProviderDetails from './register-steps/StepProviderDetails';
import StepSupplierDetails from './register-steps/StepSupplierDetails';
import {
    Home, Wrench, Boxes,
    ClipboardList, ShieldCheck, MessageCircle, BarChart2,
    Inbox, Star, Package, MapPin,
} from 'lucide-react';


const ROLE_THEME = {
    owner: { bg: 'bg-green-700', border: 'border-green-700', text: 'text-green-700', badgeBg: 'bg-green-50', badgeText: 'text-green-700', ring: 'ring-green-200' },
    provider: { bg: 'bg-blue-600', border: 'border-blue-600', text: 'text-blue-600', badgeBg: 'bg-blue-50', badgeText: 'text-blue-700', ring: 'ring-blue-200' },
    supplier: { bg: 'bg-orange-500', border: 'border-orange-500', text: 'text-orange-500', badgeBg: 'bg-orange-50', badgeText: 'text-orange-700', ring: 'ring-orange-200' },
};

// ── Info panel content per role ──────────────────────────────────────────────
const ROLE_INFO = {
    owner: {
        badge: { icon: <Home className="w-3.5 h-3.5" />, label: 'Property Owner' },
        tagline: 'Post projects and manage your construction from start to finish.',
        colors: {
            badge: 'border-green-300 bg-green-50 text-green-800',
            icon: 'bg-green-100 text-green-700',
        },
        features: [
            { icon: <ClipboardList className="w-4 h-4" />, title: 'Post Projects', desc: 'Describe your job and get matched with skilled providers.' },
            { icon: <ShieldCheck className="w-4 h-4" />, title: 'Verified Providers', desc: 'Hire only rated, background-checked professionals.' },
            { icon: <MessageCircle className="w-4 h-4" />, title: 'Direct Chat', desc: 'Communicate with contractors and suppliers in one place.' },
            { icon: <BarChart2 className="w-4 h-4" />, title: 'Track Progress', desc: 'Monitor timelines, payments, and milestones easily.' },
        ],

    },
    provider: {
        badge: { icon: <Wrench className="w-3.5 h-3.5" />, label: 'Service Provider' },
        tagline: 'Connect with property owners across Sri Lanka and grow your service business.',
        colors: {
            badge: 'border-blue-300 bg-blue-50 text-blue-800',
            icon: 'bg-blue-100 text-blue-700',
        },
        features: [
            { icon: <Inbox className="w-4 h-4" />, title: 'Receive Job Requests', desc: 'Get matched with property owners who need your skills.' },
            { icon: <Star className="w-4 h-4" />, title: 'Build Your Reputation', desc: 'Collect reviews and showcase your portfolio.' },
            { icon: <MessageCircle className="w-4 h-4" />, title: 'Chat Directly', desc: 'Communicate and close deals without middlemen.' },
            { icon: <BarChart2 className="w-4 h-4" />, title: 'Track Your Jobs', desc: 'Manage ongoing work and earnings in one dashboard.' },
        ],
    },
    supplier: {
        badge: { icon: <Boxes className="w-3.5 h-3.5" />, label: 'Supplier' },
        tagline: 'Reach thousands of active construction projects across Sri Lanka.',
        colors: {
            badge: 'border-orange-300 bg-orange-50 text-orange-800',
            icon: 'bg-orange-100 text-orange-700',
        },
        features: [
            { icon: <Package className="w-4 h-4" />, title: 'List Your Materials', desc: 'Showcase sand, cement, timber, and more to buyers.' },
            { icon: <MapPin className="w-4 h-4" />, title: 'Local Discovery', desc: 'Property owners nearby will find you first.' },
            { icon: <MessageCircle className="w-4 h-4" />, title: 'Direct Inquiries', desc: 'Buyers contact you directly — no commission fees.' },
            { icon: <BarChart2 className="w-4 h-4" />, title: 'Manage Orders', desc: 'Track inquiries and deliveries from one dashboard.' },
        ],
    },
};
const ROLE_PRIMARY = {
    owner: { bg: 'bg-green-600', border: 'border-green-600', text: 'text-green-600', bgLight: 'bg-green-50', ring: 'ring-green-600/10' },
    provider: { bg: 'bg-blue-600', border: 'border-blue-600', text: 'text-blue-600', bgLight: 'bg-blue-50', ring: 'ring-blue-600/10' },
    supplier: { bg: 'bg-orange-500', border: 'border-orange-500', text: 'text-orange-500', bgLight: 'bg-orange-50', ring: 'ring-orange-500/10' },
};

// ── Step config per role ─────────────────────────────────────────────────────
const STEP_LABELS = ['Account Setup', 'Your Details'];

function validate(step, role, creds, info, details) {
    if (step === 0) {
        if (!creds.email || !creds.email.includes('@')) return 'Please enter a valid email address.';
        if (!creds.password || creds.password.length < 8) return 'Password must be at least 8 characters.';
        if (creds.password !== creds.confirmPassword) return 'Passwords do not match.';
    }
    if (step === 1) {
        const baseRequired = ['firstName', 'lastName', 'mobile', 'nic'];
        // owner and provider share the top personal section with district+city
        if (role !== 'supplier') {
            for (const f of [...baseRequired, 'district', 'city']) {
                if (!info[f]?.trim()) return 'Please fill in all required fields.';
            }
        } else {
            for (const f of baseRequired) {
                if (!info[f]?.trim()) return 'Please fill in all required fields.';
            }
        }
        if (role === 'owner' && !details.agreeTerms) return 'You must agree to the Terms of Service to continue.';
        if (role === 'provider') {
            if (!details.primaryTrade) return 'Please select your primary trade.';
            if (!details.workRegion) return 'Please select where you can work.';
            if (!details.agreeTerms) return 'You must agree to the Terms of Service to continue.';
        }
        if (role === 'supplier') {
            if (!details.businessName?.trim()) return 'Please enter your business name.';
            if (!details.district) return 'Please select your district.';
            if (!details.city?.trim()) return 'Please enter your city.';
            if (!details.address?.trim()) return 'Please enter your business address.';
            if (!details.materials?.length) return 'Please select at least one material you supply.';
            if (!details.agreeTerms) return 'You must agree to the Terms of Service to continue.';
        }
    }
    return null;
}

// ── Main component ───────────────────────────────────────────────────────────
export default function RegisterForm() {


    const router = useRouter();
    const [role, setRole] = useState('owner');
    const [step, setStep] = useState(0); // 0 = role picker + credentials, 1 = details

    const [creds, setCreds] = useState({ email: '', password: '', confirmPassword: '' });
    const [info, setInfo] = useState({
        firstName: '', lastName: '', mobile: '', nic: '', district: '', city: '',
    });
    const [details, setDetails] = useState({
        // owner
        address: '', agreeTerms: false,
        // provider
        primaryTrade: '', experience: '', workRegion: '', skills: [], bio: '', dailyRate: '', rateType: '',
        // supplier
        businessName: '', brn: '', delivery: '', deliveryCoverage: '',
        materials: [], hasHardwareStore: false, hwStoreName: '', hwBRN: '', hwAddress: '',
        agreeVerification: false,
    });

    const [error, setError] = useState('');

    const info_panel = ROLE_INFO[role];

    const theme = ROLE_THEME[role];

    const handleNext = () => {
        const err = validate(step, role, creds, info, details);
        if (err) { setError(err); return; }
        setError('');
        if (step === 0) { setStep(1); window.scrollTo(0, 0); return; }
        // Final submit — navigate to dashboard placeholder
        router.push('/dashboard');
    };

    const handleBack = () => {
        setError('');
        setStep(0);
        window.scrollTo(0, 0);
    };

    return (
        <div className="flex gap-8 w-full max-w-[900px] items-start">

            {/* ── Info panel ── */}
            <aside className="w-64 flex-shrink-0 sticky top-20 hidden md:block">
                <div className="font-syne text-2xl font-extrabold text-amber tracking-tight mb-1">
                    Crew<span className="text-slate">Sync</span>
                </div>
                <p className="text-xs text-muted leading-relaxed mb-4">{info_panel.tagline}</p>
                <span className={`inline-flex items-center gap-1.5 rounded-full border text-xs font-semibold px-3 py-1 mb-4
  ${info_panel.colors.badge}`}>
                    {info_panel.badge.icon}
                    {info_panel.badge.label}
                </span>
                <div className="flex flex-col gap-2.5 mb-5">
                    {info_panel.features.map(f => (
                        <div key={f.title} className="flex items-start gap-2.5 bg-white border border-border
              rounded-xl p-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0 mt-0.5
  ${info_panel.colors.icon}`}>
                                {f.icon}
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate">{f.title}</p>
                                <p className="text-[11px] text-muted leading-relaxed mt-0.5">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-muted">
                    Already have an account?{' '}
                    <a href="/sign-in" className="text-primary font-semibold hover:underline">Sign in here</a>
                </p>
            </aside>

            {/* ── Form card ── */}
            <div className="flex-1 bg-white border border-border rounded-xl shadow-sm overflow-hidden">

                {/* Step bar */}
                <div className="flex items-center px-6 py-3 border-b border-border bg-surface">
                    {STEP_LABELS.map((label, i) => (
                        <div key={i} className="flex items-center">
                            <div className="flex items-center gap-2">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
  border-2 transition-all
  ${i < step ? `${theme.bg} ${theme.border} text-white`
                                        : i === step ? `${theme.bg} ${theme.border} text-white`
                                            : 'bg-white border-border text-muted'}`}>
                                    {i < step ? '✓' : i + 1}
                                </div>
                                <span className={`text-xs font-medium ${i === step ? `${theme.text} font-semibold` : 'text-muted'}`}>
                                    {label}
                                </span>
                            </div>
                            {i < STEP_LABELS.length - 1 && (
                                <div className={`h-0.5 w-10 mx-2 rounded-full transition-all ${i < step ? theme.bg : 'bg-border'}`} />
                            )
                            }
                        </div>
                    ))}
                </div>

                {/* Card header */}
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                    <div>
                        <h2 className="font-syne text-base font-bold text-slate">
                            {step === 0 ? 'Create your account' : 'Your Details'}
                        </h2>
                        <p className="text-xs text-muted mt-0.5">
                            {step === 0 ? 'Choose your role and set up your credentials.' : 'Tell us a bit about yourself.'}
                        </p>
                    </div>
                    <span className={`${theme.badgeBg} ${theme.badgeText} text-[11px] font-bold px-2.5 py-1 rounded-full`}>
                        Step {step + 1} of 2
                    </span>
                </div>

                {/* Form body */}
                <div className="p-6">
                    {/* Error banner */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-3.5 py-2.5
              text-sm mb-4">
                            {error}
                        </div>
                    )}

                    {step === 0 && (
                        <>
                            {/* Role picker */}
                            <div className="mb-6">
                                <p className="text-[11px] font-semibold text-slate-light uppercase tracking-wide mb-2">
                                    I am registering as a…
                                </p>
                                <RolePicker selected={role} onSelect={setRole} />
                            </div>
                            <StepCredentials role={role} data={creds} onChange={setCreds} />
                        </>
                    )}

                    {step === 1 && (
                        <>
                            {/* Personal info shared by owner + provider; supplier has its own top section */}
                            {role !== 'supplier' && (
                                <StepPersonalInfo data={info} onChange={setInfo} />
                            )}
                            {role === 'owner' && <StepOwnerDetails data={details} onChange={setDetails} />}
                            {role === 'provider' && <StepProviderDetails data={details} onChange={setDetails} />}
                            {role === 'supplier' && <StepSupplierDetails data={{ ...info, ...details }} onChange={(merged) => {
                                // Split back into info and details buckets
                                const { firstName, lastName, mobile, nic, ...rest } = merged;
                                setInfo(prev => ({ ...prev, firstName, lastName, mobile, nic }));
                                setDetails(prev => ({ ...prev, ...rest }));
                            }} />}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-border bg-surface flex items-center justify-between gap-3 flex-wrap">
                    <div>
                        {step > 0 ? (
                            <button
                                type="button"
                                onClick={handleBack}
                                className="px-4 py-2.5 border border-border rounded-lg text-sm text-slate-light
                  font-medium hover:bg-white transition-all"
                            >
                                ← Back
                            </button>
                        ) : (
                            <p className="text-xs text-muted max-w-xs">Your data is protected and never sold.</p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={handleNext}
                        className={`px-6 py-2.5 text-white rounded-lg text-sm font-semibold
  hover:-translate-y-px transition-all shadow-sm ${theme.bg}`}
                    >
                        {step === 0 ? 'Continue →' : 'Create Account →'}
                    </button>
                </div>
            </div>
        </div >
    );
}
