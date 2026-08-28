'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import RolePicker from './RolePicker';
import StepCredentials from './register-steps/StepCredentials';
import StepPersonalInfo from './register-steps/StepPersonalInfo';
import StepOwnerDetails from './register-steps/StepOwnerDetails';
import StepProviderDetails from './register-steps/StepProviderDetails';
import StepSupplierDetails from './register-steps/StepSupplierDetails';
import StepOtpVerification from './register-steps/StepOtpVerification';
import { registerFormSchema, REGISTER_DEFAULT_VALUES, toRegisterPayload } from '@/src/lib/validators/auth';
import { useCheckEmail, useRegister, useSendOtp } from '@/src/hooks/auth/useAuth';
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

const STEP_LABELS = ['Account Setup', 'Verify Email', 'Your Details'];

export default function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();
    const roleParam = searchParams ? searchParams.get('role') : null;
    const [step, setStep] = useState(0);
    const [error, setError] = useState('');
    const [mounted, setMounted] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        trigger,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerFormSchema),
        defaultValues: { ...REGISTER_DEFAULT_VALUES, role: roleParam === 'provider' || roleParam === 'supplier' ? roleParam : 'owner' },
    });

    const role = watch('role');
    const checkEmailMutation = useCheckEmail();
    const registerMutation = useRegister();
    const sendOtpMutation = useSendOtp();

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(t);
    }, []);
    const theme = ROLE_THEME[role];
    const tagline = ROLE_TAGLINE[role];

    const fadeTo = (nextStep) => {
        setMounted(false);
        setTimeout(() => {
            setStep(nextStep);
            window.scrollTo(0, 0);
            setMounted(true);
        }, 300);
    };

    const handleNext = async () => {
        setError('');

        if (step === 0) {
            const valid = await trigger(['email', 'password', 'confirmPassword']);
            if (!valid) return;

            try {
                const emailValue = watch('email').trim().toLowerCase();
                const data = await checkEmailMutation.mutateAsync({ email: emailValue });
                if (data.exists) {
                    setError('This email is already registered. Please login instead.');
                    return;
                }
                await sendOtpMutation.mutateAsync({ email: emailValue });
            } catch (err) {
                setError(err.message || 'Could not connect to the server. Make sure the backend is running.');
                return;
            }
            fadeTo(1);
            return;
        }

        if (step === 1) {
            // Verification happens inside StepOtpVerification itself via onVerified.
            // This step has no shared "Continue" button — nothing to do here.
            return;
        }

        const valid = await trigger();
        if (!valid) return;
        await handleSubmit(onSubmit)();
    };

    const handleOtpVerified = (otpToken) => {
        setValue('otp_token', otpToken);
        fadeTo(2);
    };

    const onSubmit = async (values) => {
        setError('');

        const payload = toRegisterPayload(values);

        try {
            const data = await registerMutation.mutateAsync(payload);

            login({
                user_id: data.user_id,
                name: `${payload.fname} ${payload.lname}`,
                role: payload.role,  // e.g. "property_owner"
            });
            router.push('/dashboard/propertyowner');
        } catch (err) {
            setError(err.message || 'Could not connect to the server. Make sure the backend is running.');
        }
    };

    const handleBack = () => {
        setError('');
        fadeTo(0);
    };

    const formProps = { register, errors, watch, setValue };

    return (
        <div
            className="flex w-full max-w-[1100px] items-stretch mb-0"
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
                            onClick={() => setValue('role', r)}
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
                        Step {step + 1} of {STEP_LABELS.length}
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
                                <RolePicker selected={role} onSelect={(id) => setValue('role', id)} />
                            </div>
                            <StepCredentials {...formProps} />
                        </>
                    )}

                    {step === 1 && (
                        <StepOtpVerification
                            email={watch('email').trim().toLowerCase()}
                            theme={theme}
                            onVerified={handleOtpVerified}
                        />
                    )}

                    {step === 2 && (
                        <>
                            {role !== 'supplier' && <StepPersonalInfo {...formProps} />}
                            {role === 'owner' && <StepOwnerDetails {...formProps} />}
                            {role === 'provider' && <StepProviderDetails {...formProps} />}
                            {role === 'supplier' && <StepSupplierDetails {...formProps} />}
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
                                Back
                            </button>
                        ) : (
                            <p className="text-xs text-muted max-w-xs">Your data is protected and never sold.</p>
                        )}
                    </div>

                    {step !== 1 && (
                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={checkEmailMutation.isPending || sendOtpMutation.isPending || registerMutation.isPending}
                            className={`px-6 py-2.5 text-white rounded-lg text-sm font-semibold hover:-translate-y-px transition-all shadow-sm ${theme.bg} disabled:opacity-60`}
                        >
                            {checkEmailMutation.isPending || sendOtpMutation.isPending
                                ? 'Sending code…'
                                : registerMutation.isPending
                                    ? 'Creating…'
                                    : step === 2 ? 'Create Account ' : 'Continue'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
