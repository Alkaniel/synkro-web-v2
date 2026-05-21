import {useAuth} from "@/context/AuthContext.tsx";
import {useApi} from "@/hooks/useApi.ts";
import {adminApi} from "@/api/admin.ts";
import {Navigate} from "react-router-dom";
import type {UserRole} from "@/types/api.ts";
import {toast} from "sonner";
import {ApiError} from "@/api/errors.ts";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Button} from "@/components/ui/button.tsx";

export default function AdminUsersPage() {
    const { user } = useAuth();
    const { data: users, loading, refetch } = useApi(() => adminApi.listUsers(), []);

    if (user?.role !== "ROLE_ADMIN") {
        return <Navigate to="/projects" replace />;
    }

    const handleChangeRole = async (id: string, newRole: UserRole)=> {
        try {
            await adminApi.changeRole(id, newRole);
            toast.success('Rôle mis à jour');
            refetch();
        } catch (err) {
            if (err instanceof ApiError) toast.error(err.message);
            else toast.error('Erreur inattendue');
        }
    };

    const handleDeleteUser = async (id: string, username: string) => {
        if (!confirm(`Supprimer le compte de ${username} ? Action irréversible.`)) return;
        try {
            await adminApi.deleteUser(id);
            toast.success(`Compte de ${username} supprimé`);
            refetch();
        } catch (err) {
            if (err instanceof ApiError) toast.error(err.message);
            else toast.error('Erreur inattendue');
        }
    };

    if (loading) return <p>Chargement des utilisateurs...</p>;

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>

            <div className="bg-white border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b text-left">
                    <tr>
                        <th className="px-4 py-3 font-medium">Utilisateur</th>
                        <th className="px-4 py-3 font-medium">Email</th>
                        <th className="px-4 py-3 font-medium">Rôle</th>
                        <th className="px-4 py-3 font-medium">Inscrit le</th>
                        <th className="px-4 py-3"></th>
                    </tr>
                    </thead>
                    <tbody className="divide-y">
                    {users?.map((u) => (
                        <tr
                            key={u.id}
                            className={u.id === user.id ? 'bg-blue-50' : 'hover:bg-gray-50'}
                        >
                            <td className="px-4 py-3 font-medium">{u.username}</td>
                            <td className="px-4 py-3 text-gray-600">{u.email}</td>
                            <td className="px-4 py-3">
                                {u.id === user.id ? (
                                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                                        Admin (vous)
                                    </span>
                                ) : (
                                    <Select value={u.role} onValueChange={(v) => handleChangeRole(u.id, v as UserRole)}>
                                        <SelectTrigger className="w-32 h-8 text-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ROLE_USER">User</SelectItem>
                                            <SelectItem value="ROLE_ADMIN">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            </td>
                            <td className="px-4 py-3 text-gray-500">
                                {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="px-4 py-3">
                                {u.id !== user.id && (
                                    <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(u.id, u.username)}>
                                        Supprimer
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}