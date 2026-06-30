'use client';

import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const MOCK_USER = {
    id: 1,
    name: 'Nimal Kumarasinghe',
    email: 'nimal@example.com',
    role: 'ADMIN',  // change to 'SERVICE_PROVIDER' or 'MATERIAL_SUPPLIER' to test
    avatar: 'NK',
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(MOCK_USER);

    function login(userData) { setUser(userData); }
    function logout() { setUser(null); }

    return (
        <AuthContext.Provider value={{
            user,
            role: user?.role ?? null,
            login,
            logout,
            isOwner: user?.role === 'PROPERTY_OWNER',
            isProvider: user?.role === 'SERVICE_PROVIDER',
            isSupplier: user?.role === 'MATERIAL_SUPPLIER',
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