'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { getMe, logout } from '@/src/api/userApi';

const AuthContext = createContext(null);


export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Rehydrate user from cookie on every page load
    useEffect(() => {
        async function rehydrate() {
            try {
                const data = await getMe();
                setUser(normalizeUser(data.user));
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        rehydrate();
    }, []);

    function login(userData) {
        setUser(normalizeUser(userData));
    }

    async function logoutUser() {
        try {
            await logout();
        } catch (err) {}
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            role: user?.role ?? null,
            login,
            logout: logoutUser,
            isGuest:    user === null,
            isOwner:    user?.role === 'property_owner',
            isProvider: user?.role === 'service_provider',
            isSupplier: user?.role === 'material_supplier',
            isAdmin:    user?.role === 'admin',
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}

function normalizeUser(userData) {
    return {
        user_id: userData.user_id,
        name:    userData.name,
        role:    userData.role,
        avatar:  userData.name
                    ?.split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2) ?? 'U',
    };
}
