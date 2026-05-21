import {Navigate, Route, Routes} from "react-router-dom";
import {Login} from "@/features/auth/pages/Login.tsx";
import Register from "@/features/auth/pages/Register.tsx";
import AuthGuard from "@/components/layout/AuthGuard.tsx";
import ProjectsList from "@/features/projects/pages/ProjectsList.tsx";
import MainLayout from "@/components/layout/MainLayout.tsx";
import ProjectDetail from "@/features/projects/pages/ProjectDetail.tsx";
import ProfilePage from "@/features/profile/pages/ProfilePage.tsx";
import AdminUsersPage from "@/features/admin/pages/AdminUsersPage.tsx";

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* AuthRequired */}
            <Route element={<AuthGuard />}>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Navigate to="/projects" replace />} />
                    <Route path="/projects" element={<ProjectsList />} />
                    <Route path="/projects/:id" element={<ProjectDetail />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/admin/users" element={<AdminUsersPage />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}