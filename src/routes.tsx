import {Navigate, Route, Routes} from "react-router-dom";
import Login from "@/features/auth/pages/Login.tsx";
import Register from "@/features/auth/pages/Register.tsx";
import AuthGuard from "@/components/layout/AuthGuard.tsx";
import ProjectsList from "@/features/projects/pages/ProjectsList.tsx";

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* AuthRequired */}
            <Route element={<AuthGuard />}>
                <Route path="/" element={<Navigate to="/projects" replace />} />
                <Route path="/projects" element={<ProjectsList />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}