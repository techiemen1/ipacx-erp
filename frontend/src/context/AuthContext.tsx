import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    username: string;
    tenantId: string;
    token?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (username: string, tenantId: string, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const storedUser = localStorage.getItem('ipacx_user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (e) {
                console.error("Failed to parse user", e);
                localStorage.removeItem('ipacx_user');
            } finally {
                setIsLoading(false);
            }
        };
        initAuth();
    }, []);

    const login = (username: string, tenantId: string, token: string) => {
        const newUser = { username, tenantId, token };
        setUser(newUser);
        localStorage.setItem('ipacx_user', JSON.stringify(newUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('ipacx_user');
        window.location.href = '/login'; // Force redirect
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
