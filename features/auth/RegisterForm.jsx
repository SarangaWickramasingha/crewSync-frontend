'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import RolePicker from './RolePicker';
import StepCredentials from './register-steps/StepCredentials';
import StepPersonalInfo from './register-steps/StepPersonalInfo';
import StepOwnerDetails from './register-steps/StepOwnerDetails';
import StepProviderDetails from './register-steps/StepProviderDetails';
import StepSupplierDetails from './register-steps/StepSupplierDetails';
import { API_AUTH_REGISTER, API_AUTH_CHECK_EMAIL } from '@/config/api';
import { SKILL_NAME_TO_ID, MATERIAL_NAME_TO_ID, ROLE_MAP } from '@/constants/registerMaps';
import { useAuth } from '@/context/AuthContext';



const ROLE_THEME = {
    owner: { bg: 'bg-green-700', border: 'border-green-700', text: 'text-green-700', badgeBg: 'bg-green-50', badgeText: 'text-green-700' },
    provider: { bg: 'bg-blue-600', border: 'border-blue-600', text: 'text-blue-600', badgeBg: 'bg-blue-50', badgeText: 'text-blue-700' },
    supplier: { bg: 'bg-orange-500', border: 'border-orange-500', text: 'text-orange-500', badgeBg: 'bg-orange-50', badgeText: 'text-orange-700' },
};

const ROLE_TAGLINE = {
    owner: { heading: 'Build your dream project.', sub: 'Connect with trusted professionals across Sri Lanka.' },
    provider: { heading: 'Grow your trade business.', sub: 'Find clients who need your skills today.' },
    supplier: { heading: 'Reach more buyers.', sub: 'Supply materials to active construction projects.' },
};

const STEP_LABELS = ['Account Setup', 'Your Details'];

function validate(step, role, creds, info, details) {
    if (step === 0) {
        if (!creds.email || !creds.email.includes('@')) return 'Please enter a valid email address.';
        if (!creds.password || creds.password.length < 8) return 'Password must be at least 8 characters.';
        if (creds.password !== creds.confirmPassword) return 'Passwords do not match.';
    }
    if (step === 1) {
        const baseRequired = ['firstName', 'lastName', 'mobile'];
        if (role !== 'supplier') {
            for (const f of [...baseRequired, 'district']) {
                if (!info[f]?.trim()) return 'Please fill in all required fields.';
            }
        } else {
            for (const f of baseRequired) {
                if (!info[f]?.trim()) return 'Please fill in all required fields.';
            }
        }
        if (role === 'owner' && !details.agreeTerms) return 'You must agree to the Terms of Service to continue.';
        if (role === 'provider') {
            if (!details.agreeTerms) return 'You must agree to the Terms of Service to continue.';
        }
        if (role === 'supplier') {
            if (!details.businessName?.trim()) return 'Please enter your business name.';
            if (!details.district) return 'Please select your district.';
            /*reomve city too ashaaaaa */
            if (!details.address?.trim()) return 'Please enter your business address.';
            if (!details.materials?.length) return 'Please select at least one material you supply.';
            if (!details.agreeTerms) return 'You must agree to the Terms of Service to continue.';
        }
    }
    return null;
}

export default function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth()
    const roleParam = searchParams ? searchParams.get('role') : null;
    const [role, setRole] = useState(roleParam === 'provider' || roleParam === 'supplier' ? roleParam : 'owner');
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);


    const [creds, setCreds] = useState({ email: '', password: '', confirmPassword: '' });
    const [info, setInfo] = useState({
        firstName: '', lastName: '', mobile: '', district: '',
    });
    const [details, setDetails] = useState({
        address: '', agreeTerms: false,
        /* primaryTrade: ''*/ experience: '', /*workRegion: ''*/ skills: [], bio: '', dailyRate: '', rateType: '',
        businessName: '', brn: '', delivery: '', deliveryCoverage: '',
        materials: [], hasHardwareStore: false, hwStoreName: '', hwBRN: '', hwAddress: '',
        agreeVerification: false,
    });

    const [error, setError] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(t);
    }, []);
    const theme = ROLE_THEME[role];
    const tagline = ROLE_TAGLINE[role];

    const handleNext = async () => {
        const err = validate(step, role, creds, info, details);
        if (err) { setError(err); return; }
        setError('');

        if (step === 0) {
            setLoading(true);
            try {
                const res = await fetch(API_AUTH_CHECK_EMAIL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: creds.email.trim().toLowerCase() }),
                });
                const data = await res.json();
                if (data.exists) {
                    setError('This email is already registered. Please login instead.');
                    setLoading(false);
                    return;
                }
            } catch (err) {
                setError('Could not connect to the server. Make sure the backend is running.');
                setLoading(false);
                return;
            }
            setLoading(false);
            setMounted(false);
            setTimeout(() => {
                setStep(1);
                window.scrollTo(0, 0);
                setMounted(true);
            }, 300);
            return;
        }
        // router.push('/dashboard');
        handleSubmit()
    };

    const handleBack = () => {
        setError('');
        setMounted(false); // fade out
        setTimeout(() => {
            setStep(0);
            window.scrollTo(0, 0);
            setMounted(true); // fade in
        }, 300);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        const payload = {
            email: creds.email.trim().toLowerCase(),
            password: creds.password,
            role: ROLE_MAP[role],
            fname: info.firstName.trim(),
            lname: info.lastName.trim(),
            contact_no: info.mobile.trim(),
            district: role === 'supplier' ? details.district : info.district,
        };

        if (role === 'owner') {
            payload.address = details.address?.trim() ?? '';
        }

        if (role === 'provider') {
            payload.bio = details.bio?.trim() ?? '';
            payload.charge_per_day = details.dailyRate ?? null;
            payload.willing_outside_region = details.workOutsideRegion ? 1 : 0;
            payload.skill_ids = (details.skills || [])
                .map(name => SKILL_NAME_TO_ID[name])
                .filter(Boolean);
        }

        if (role === 'supplier') {
            payload.business_name = details.businessName?.trim() ?? '';
            payload.business_address = details.address?.trim() ?? '';
            payload.brn = details.brn?.trim() ?? '';
            payload.delivery = details.delivery ? 1 : 0;
            payload.is_hardware_shop = details.hasHardwareStore ? 1 : 0;
            payload.material_ids = (details.materials || [])
                .map(name => MATERIAL_NAME_TO_ID[name])
                .filter(Boolean);
            if (details.hasHardwareStore) {
                payload.hw_store_name = details.hwStoreName?.trim() ?? '';
                payload.hw_br_number = details.hwBRN?.trim() ?? '';
                payload.hw_address = details.hwAddress?.trim() ?? '';
            }
        }

        try {
            const res = await fetch(API_AUTH_REGISTER, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (data.success) {
                login({
                    user_id: data.user_id,
                    name: `${payload.fname} ${payload.lname}`,
                    role: payload.role,  // e.g. "property_owner"
                })
                router.push('/dashboard/propertyowner');
            } else {
                setError(data.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            setError('Could not connect to the server. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div
            className="flex w-full max-w-[1100px] items-stretch"
            style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(24px)',
                transition: 'opacity 0.7s ease, transform 0.7s ease',
            }}
        >
            {/* ── Left: Image Panel ── */}
            <aside className="hidden lg:flex lg:w-[420px] flex-shrink-0 relative overflow-hidden rounded-l-2xl flex-col">
                {/* Image */}
                <img
                    src={`/images/register-${role}.jpg`}
                    alt={`${role} registration`}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#1A1D23]/60 to-[#1A1D23]/90" />

                {/* Top: dark role switcher */}
                <div className="relative z-10 p-5 flex gap-2">
                    {['owner', 'provider', 'supplier'].map(r => (
                        <button
                            key={r}
                            onClick={() => setRole(r)}
                            className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all
                                ${role === r
                                    ? 'bg-white/20 text-white border border-white/30'
                                    : 'text-white/50 hover:text-white/80'
                                }`}
                        >
                            {r === 'owner' ? 'Owner' : r === 'provider' ? 'Provider' : 'Supplier'}
                        </button>
                    ))}
                </div>

                {/* Bottom: tagline */}
                <div className="relative z-10 mt-auto p-8">
                    <p className="font-climate text-2xl text-[#E8820C]">
                        Crew<span className="text-white">Sync</span>
                    </p>
                    <p className="text-white font-bold text-xl mt-2">{tagline.heading}</p>
                    <p className="text-white/60 text-sm mt-1">{tagline.sub}</p>
                </div>
            </aside>

            {/* ── Right: Form card ── */}
            <div className="flex-1 bg-white border border-border rounded-r-2xl shadow-sm overflow-hidden flex flex-col">

                {/* Dark top bar with step indicator */}
                <div className="bg-[#1A1D23] px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {STEP_LABELS.map((label, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold border-2 transition-all
                                    ${i < step ? `${theme.bg} ${theme.border} text-white`
                                        : i === step ? `${theme.bg} ${theme.border} text-white`
                                            : 'border-white/20 text-white/40'}`}>
                                    {i < step ? '✓' : i + 1}
                                </div>
                                <span className={`text-[11px] font-medium ${i === step ? 'text-white' : 'text-white/40'}`}>
                                    {label}
                                </span>
                                {i < STEP_LABELS.length - 1 && (
                                    <div className={`h-0.5 w-8 rounded-full ${i < step ? theme.bg : 'bg-white/10'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <span className={`${theme.badgeBg} ${theme.badgeText} text-[11px] font-bold px-2.5 py-1 rounded-full`}>
                        Step {step + 1} of 2
                    </span>
                </div>

                {/* Form body */}
                <div
                    className="p-6 flex-1 overflow-y-auto"
                    style={{
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? 'translateY(0)' : 'translateY(16px)',
                        transition: 'opacity 0.4s ease, transform 0.4s ease',
                    }}
                >                    {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-3.5 py-2.5 text-sm mb-4">
                        {error}
                    </div>
                )}

                    {step === 0 && (
                        <>
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
                            {role !== 'supplier' && <StepPersonalInfo data={info} onChange={setInfo} />}
                            {role === 'owner' && <StepOwnerDetails data={details} onChange={setDetails} />}
                            {role === 'provider' && <StepProviderDetails data={details} onChange={setDetails} />}
                            {role === 'supplier' && <StepSupplierDetails data={{ ...info, ...details }} onChange={(merged) => {
                                const { firstName, lastName, mobile, ...rest } = merged;
                                setInfo(prev => ({ ...prev, firstName, lastName, mobile }));
                                setDetails(prev => ({ ...prev, ...rest }));
                            }} />}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-border bg-surface flex items-center justify-between gap-3">
                    <div>
                        {step > 0 ? (
                            <button
                                type="button"
                                onClick={handleBack}
                                className="px-4 py-2.5 border border-border rounded-lg text-sm text-slate-light font-medium hover:bg-white transition-all"
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
                        className={`px-6 py-2.5 text-white rounded-lg text-sm font-semibold hover:-translate-y-px transition-all shadow-sm ${theme.bg}`}
                    >{ }
                        {loading ? 'Checking…' : step === 0 ? 'Continue →' : 'Create Account →'}
                    </button>
                </div>
            </div>
        </div>
    );
}