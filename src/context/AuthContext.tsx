import {createContext, type ReactNode, useContext, useEffect, useState} from "react";
import {api, setApiToken} from "@/api/client.ts";

interface AuthContextType {
    accessToken: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const login = (token: string) => {
        setAccessToken(token);
        setApiToken(token);
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout", {}, { credentials: "include"});
        } catch (err) {
            console.error("Error logging out:", err);
        } finally {
            setAccessToken(null);
            setApiToken(null);
        }
    };

    useEffect(() => {
       const silentRefresh = async () => {
           try {
               const response = await api.post<{ accessToken: string }>(
                   "/auth/refresh",
                   {},
                   { credentials: "include" }
               );
               setAccessToken(response.accessToken);
               setApiToken(response.accessToken);
           } catch (err) {
               setAccessToken(null);
               setApiToken(null);
           } finally {
               setLoading(false);
           }
       }

       silentRefresh();
    }, []);

    return (
        <AuthContext.Provider value={{accessToken, isAuthenticated: !!accessToken, loading, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}