import { Navigate, Outlet } from "react-router-dom";
import {useAuth} from "@/context/AuthContext.tsx";

export default function AuthGuard() {
    const { user, loading } = useAuth();
    if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
    if (!user) return <Navigate to="/login" replace />;
    return <Outlet />;
}