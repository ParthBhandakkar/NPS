import { createContext } from 'react';

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'patient';
    specialization?: string;
    hospital?: string;
    age?: number;
    language?: string;
    literacyLevel?: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    age?: number;
    language?: string;
    literacyLevel?: string;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);