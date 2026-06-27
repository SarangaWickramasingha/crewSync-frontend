'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
    const { role } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Redirect admin to admin overview
        if (role === 'ADMIN') {
            router.replace('/dashboard/admin');
        }
    }, [role]);

    return (
        <div>
            <h2 className="font-syne text-xl font-bold text-slate mb-2">Welcome back!</h2>
            <p className="text-xs text-muted">
                {role === 'PROPERTY_OWNER' && 'Manage your construction projects from here.'}
                {role === 'SERVICE_PROVIDER' && 'View your job requests and manage your work.'}
                {role === 'MATERIAL_SUPPLIER' && 'Manage your products and incoming orders.'}
            </p>
            {/* TODO: add role-specific overview widgets */}
        </div>
    );
}
