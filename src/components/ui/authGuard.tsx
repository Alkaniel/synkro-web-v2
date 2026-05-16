import { Navigate, Outlet } from "react-router-dom";
import {useAuth} from "@/context/AuthContext.tsx";

export default function AuthGuard() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#6898E4] to-[#BED3F3]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
            </div>
        );
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}