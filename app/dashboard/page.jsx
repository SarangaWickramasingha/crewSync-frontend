'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
    const { role, isGuest, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        if (isGuest) {
            router.replace('/dashboard/propertyowner/timeline');
            return;
        }

        if (role === 'property_owner') {
            router.replace('/dashboard/propertyowner');
        } else if (role === 'admin') {
            router.replace('/dashboard/admin');
        } else if (role === 'service_provider') {
            router.replace('/dashboard/serviceprovider');
        } else if (role === 'material_supplier') {
            router.replace('/dashboard/supplier');
        } else {
            router.replace('/login');
        }
    }, [role, isGuest, loading, router]);

    return null;
}