import {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useApi } from '@/hooks/useApi';
import { projectsApi } from '@/api/projects';
import { Button } from '@/components/ui/button';
import ProjectFormDialog from "@/features/projects/pages/ProjectFormDialog.tsx";

export default function ProjectsList() {
    const { data: projects, loading, error, refetch } = useApi(() => projectsApi.list(), []);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    if (loading) return <p>Chargement...</p>;
    if (error) {
        return <p>Erreur de chargement des projets.</p>;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Mes projets</h1>
                <Button onClick={() => setDialogOpen(true)}>Nouveau projet</Button>
            </div>

            {projects && projects.length === 0 && (
                <p className="text-gray-500">Aucun projet pour l'instant. Crées-en un !</p>
            )}

            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects?.map((p) => (
                    <li key={p.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                        <Link to={`/projects/${p.id}`} className="block">
                            <h2 className="font-semibold text-lg">{p.name}</h2>
                            {p.description && <p className="text-sm text-gray-600 mt-1">{p.description}</p>}
                            <p className="text-xs text-gray-400 mt-2">par {p.owner.username}</p>
                        </Link>
                    </li>
                ))}
            </ul>

            <ProjectFormDialog open={dialogOpen} onOpenChange={setDialogOpen}
                onSuccess={() => {
                    setDialogOpen(false);
                    refetch();
                }}
            />
        </div>
    );
}