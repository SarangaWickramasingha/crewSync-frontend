'use client';

import { Suspense } from 'react';
import RegisterForm from '@/features/auth/RegisterForm';
import Navbar from '@/Components/layout/Navbar';

export default function RegisterPage() {
    return (
        <>
            <Navbar variant="register" />
            <div className="flex-1 flex items-start justify-center px-4 py-8 bg-surface relative overflow-hidden">
                {/* Subtle radial glow — top-right */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute -top-20 -right-20 w-[450px] h-[450px]
          rounded-full bg-[radial-gradient(circle,rgba(27,110,58,0.07)_0%,transparent_70%)]"
                />
                <Suspense fallback={
                    <div className="w-full max-w-[1100px] bg-white border border-border rounded-2xl shadow-sm p-8 flex items-center justify-center min-h-[400px]">
                        <p className="text-muted text-sm">Loading registration form...</p>
                    </div>
                }>
                    <RegisterForm />
                </Suspense>
            </div>
        </>
    );
}

