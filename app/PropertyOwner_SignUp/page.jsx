'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import InfoPanel from '@/components/PropertyOwner_SignUp/InfoPanel';
import StepsBar from '@/components/PropertyOwner_SignUp/StepsBar';
import Step1AccountSetup from '@/components/PropertyOwner_SignUp/AccountSetup';
import Step2PersonalInfo from '@/components/PropertyOwner_SignUp/PersonalInfo';

export default function SignupPropertyOwnerPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');

    // Step 1 fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Step 2 fields
    const [personal, setPersonal] = useState({
        firstName: '',
        lastName: '',
        mobile: '',
        nic: '',
        district: '',
        city: '',
        address: '',
        agreeTerms: false,
    });

    const handleStep1Change = (field, value) => {
        if (field === 'email') setEmail(value);
        if (field === 'password') setPassword(value);
        if (field === 'confirmPassword') setConfirmPassword(value);
        setError('');
    };

    const handleStep2Change = (field, value) => {
        setPersonal((prev) => ({ ...prev, [field]: value }));
        setError('');
    };

    const validateStep1 = () => {
        if (!email) { setError('Please enter your email address.'); return false; }
        if (!email.includes('@')) { setError('Please enter a valid email address.'); return false; }
        if (!password) { setError('Please enter a password.'); return false; }
        if (password.length < 8) { setError('Password must be at least 8 characters.'); return false; }
        if (password !== confirmPassword) { setError('Passwords do not match.'); return false; }
        return true;
    };

    const validateStep2 = () => {
        const required = ['firstName', 'lastName', 'mobile', 'nic', 'district', 'city'];
        for (const field of required) {
            if (!String(personal[field]).trim()) {
                setError('Please fill in all required fields.');
                return false;
            }
        }
        if (!personal.agreeTerms) {
            setError('You must agree to the Terms of Service to continue.');
            return false;
        }
        return true;
    };

    const handleNext = () => {
        setError('');
        if (step === 1) {
            if (validateStep1()) setStep(2);
        } else {
            if (validateStep2()) router.push('/dashboard');
        }
        window.scrollTo(0, 0);
    };

    const handleBack = () => {
        setError('');
        setStep(1);
        window.scrollTo(0, 0);
    };

    const cardTitles = {
        1: { title: 'Create your account', sub: 'Start with your email and a secure password', badge: 'Step 1 of 2' },
        2: { title: 'Personal Information', sub: 'Tell us a bit about yourself and your project', badge: 'Step 2 of 2' },
    };
    const current = cardTitles[step];

    return (
        <>

            <div className="flex-1 flex px-4 pt-8 pb-12 items-start justify-center relative overflow-hidden bg-[#F7F6F2] min-h-screen">
                {/* Background decoration */}
                <div className="absolute -top-20 -right-20 w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(27,110,58,0.07)_0%,transparent_70%)] pointer-events-none" />

                <div className="flex gap-8 w-full max-w-[900px] items-start">
                    {/* Info Panel */}
                    <InfoPanel />

                    {/* Form Card */}
                    <div className="flex-1 bg-white border border-black/10 rounded-xl shadow-[0_2px_16px_rgba(26,29,35,0.08)] overflow-hidden">
                        <StepsBar currentStep={step} />

                        {/* Card Header */}
                        <div className="px-8 py-6 border-b border-black/10 flex items-center justify-between">
                            <div>
                                <h2 className="font-syne text-lg font-bold">{current.title}</h2>
                                <p className="text-xs text-[#8A8FA8] mt-0.5">{current.sub}</p>
                            </div>
                            <span className="bg-[#E6F4EC] text-[#1B6E3A] text-xs font-bold px-3 py-1 rounded-full">
                                {current.badge}
                            </span>
                        </div>

                        {/* Form Body */}
                        <div className="p-8">
                            {/* Error Banner */}
                            {error && (
                                <div className="bg-red-50 text-red-700 border border-red-200/60 rounded-lg px-4 py-2.5 text-sm mb-5">
                                    {error}
                                </div>
                            )}

                            {step === 1 ? (
                                <Step1AccountSetup
                                    email={email}
                                    password={password}
                                    confirmPassword={confirmPassword}
                                    onChange={handleStep1Change}
                                />
                            ) : (
                                <Step2PersonalInfo data={personal} onChange={handleStep2Change} />
                            )}
                        </div>

                        {/* Form Footer */}
                        <div className="px-8 py-5 border-t border-black/10 bg-[#F7F6F2] flex items-center justify-between gap-4 flex-wrap">
                            <div>
                                {step === 2 ? (
                                    <button
                                        onClick={handleBack}
                                        className="px-5 py-2.5 bg-transparent text-[#4A5068] border border-black/10 rounded-lg text-sm font-medium hover:bg-[#F7F6F2] transition-all cursor-pointer"
                                    >
                                        ← Back
                                    </button>
                                ) : (
                                    <p className="text-xs text-[#8A8FA8] max-w-xs leading-relaxed">
                                        Your data is protected and never sold.
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={handleNext}
                                className="px-7 py-2.5 bg-[#1B6E3A] text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-all hover:bg-[#145A2E] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(27,110,58,0.3)] whitespace-nowrap"
                            >
                                {step === 1 ? 'Continue →' : 'Create Account →'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
