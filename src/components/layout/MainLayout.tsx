import { Outlet, Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export default function MainLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch {
            toast.error('Erreur lors de la déconnexion');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                    <Link to="/projects" className="text-xl font-bold">Synkro</Link>
                    <nav className="flex items-center gap-4">
                        <Link to="/projects" className="hover:underline">Projets</Link>
                        <Link to="/profile" className="hover:underline">Profil</Link>
                        {user?.role === 'ROLE_ADMIN' && (
                            <Link to="/admin/users" className="hover:underline">Admin</Link>
                        )}
                        <span className="text-sm text-gray-600">{user?.username}</span>
                        <Button variant="outline" size="sm" onClick={handleLogout}>Déconnexion</Button>
                    </nav>
                </div>
            </header>
            <main className="max-w-6xl mx-auto px-4 py-6">
                <Outlet />
            </main>
        </div>
    );
}