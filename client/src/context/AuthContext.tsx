import { useState, type ReactNode } from 'react';
import api from '../lib/api';
import { AuthContext, type RegisterData, type User } from './authContextStore';

interface StoredAuthState {
    user: User | null;
    token: string | null;
}

function getStoredAuthState(): StoredAuthState {
    const savedToken = localStorage.getItem('med_token');
    const savedUser = localStorage.getItem('med_user');

    if (!savedToken || !savedUser) {
        return { user: null, token: null };
    }

    try {
        return { user: JSON.parse(savedUser) as User, token: savedToken };
    } catch {
        localStorage.removeItem('med_token');
        localStorage.removeItem('med_user');
        return { user: null, token: null };
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const initialState = getStoredAuthState();
    const [user, setUser] = useState<User | null>(initialState.user);
    const [token, setToken] = useState<string | null>(initialState.token);
    const [loading] = useState(false);

    const login = async (email: string, password: string) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('med_token', data.token);
        localStorage.setItem('med_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
    };

    const register = async (regData: RegisterData) => {
        const { data } = await api.post('/auth/register', regData);
        localStorage.setItem('med_token', data.token);
        localStorage.setItem('med_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
    };

    const logout = () => {
        localStorage.removeItem('med_token');
        localStorage.removeItem('med_user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
            {children}
        </AuthContext.Provider>
    );
}
