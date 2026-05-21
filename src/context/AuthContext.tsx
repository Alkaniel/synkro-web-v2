import {createContext, type ReactNode, useContext, useEffect, useState} from "react";
import type {UserResponse} from "@/types/api.ts";
import {authApi} from "@/api/auth.ts";
import {setApiToken} from "@/api/client.ts";
import {ApiError} from "@/api/errors.ts";

interface AuthContextValue {
    user: UserResponse | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children : ReactNode }) {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const { accessToken } = await authApi.refresh();
                setApiToken(accessToken);
                const me = await authApi.me();
                setUser(me);
            } catch {
                setApiToken(null)
                setUser(null)
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const login = async (email: string, password: string) => {
        const { accessToken } = await authApi.login({email, password});
        setApiToken(accessToken);
        const me = await authApi.me();
        setUser(me);
    };

    const register = async (username: string, email: string, password: string) => {
        const { accessToken } = await authApi.register({username, email, password});
        setApiToken(accessToken);
        const me = await authApi.me();
        setUser(me);
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (e) {
            if (!(e instanceof ApiError)) throw e;
        }
        setApiToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{user, loading, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}