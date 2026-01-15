import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    username: string;
    tenantId: string;
}

interface AuthContextType {
    user: User | null;
    login: (username: string, tenantId: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('ipacx_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (username: string, tenantId: string) => {
        const newUser = { username, tenantId };
        setUser(newUser);
        localStorage.setItem('ipacx_user', JSON.stringify(newUser));
        // Force refresh axios headers or similar if needed in future
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('ipacx_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
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
