'use client';
import { useState, useEffect, useRef } from 'react';
import { useSendOtp, useVerifyOtp } from '@/src/hooks/auth/useAuth';

const RESEND_COOLDOWN = 60; // seconds

export default function StepOtpVerification({ email, theme, onVerified }) {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
    const inputRef = useRef(null);

    const verifyOtpMutation = useVerifyOtp();
    const sendOtpMutation = useSendOtp();

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setInterval(() => setCooldown(c => c - 1), 1000);
        return () => clearInterval(t);
    }, [cooldown]);

    const handleVerify = async () => {
        setError('');
        if (otp.length !== 6) {
            setError('Enter the 6-digit code.');
            return;
        }
        try {
            const data = await verifyOtpMutation.mutateAsync({ email, otp });
            if (!data.success) {
                setError(data.message || 'Invalid or expired code.');
                return;
            }
            onVerified(data.otp_token);
        } catch (err) {
            setError(err.message || 'Could not verify code. Please try again.');
        }
    };

    const handleResend = async () => {
        setError('');
        try {
            await sendOtpMutation.mutateAsync({ email });
            setCooldown(RESEND_COOLDOWN);
            setOtp('');
            inputRef.current?.focus();
        } catch (err) {
            setError(err.message || 'Could not resend code. Please try again.');
        }
    };

    const handleOtpChange = (e) => {
        const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
        setOtp(digits);
        if (error) setError('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && otp.length === 6) {
            handleVerify();
        }
    };

    return (
        <div className="max-w-md mx-auto text-center">
            <div className="mb-6">
                <h3 className="font-syne text-lg font-bold text-slate">Verify your email</h3>
                <p className="text-sm text-muted mt-1">
                    We sent a 6-digit code to <span className="font-medium text-slate">{email}</span>
                </p>
            </div>

            <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={otp}
                onChange={handleOtpChange}
                onKeyDown={handleKeyDown}
                placeholder="000000"
                maxLength={6}
                className="w-full text-center text-2xl font-bold tracking-[0.5em] px-3 py-3 border border-border rounded-lg
                    text-slate bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10
                    placeholder:text-muted placeholder:tracking-[0.5em]"
            />

            {error && (
                <p className="text-xs text-red-500 mt-2">{error}</p>
            )}

            <button
                type="button"
                onClick={handleVerify}
                disabled={verifyOtpMutation.isPending || otp.length !== 6}
                className={`w-full mt-4 py-2.5 text-white rounded-lg text-sm font-semibold transition-all shadow-sm ${theme.bg} disabled:opacity-50`}
            >
                {verifyOtpMutation.isPending ? 'Verifying…' : 'Verify Code'}
            </button>

            <div className="mt-4 text-xs text-muted">
                {cooldown > 0 ? (
                    <span>Resend code in {cooldown}s</span>
                ) : (
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={sendOtpMutation.isPending}
                        className={`font-semibold ${theme.text} hover:underline disabled:opacity-50`}
                    >
                        {sendOtpMutation.isPending ? 'Sending…' : "Didn't get it? Resend code"}
                    </button>
                )}
            </div>
        </div>
    );
}
