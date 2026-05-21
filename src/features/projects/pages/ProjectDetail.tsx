import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useApi } from '@/hooks/useApi';
import { projectsApi } from '@/api/projects';
import { Button } from '@/components/ui/button';
import ProjectFormDialog from "@/features/projects/pages/ProjectFormDialog.tsx";
import TaskList from "@/features/tasks/components/TaskList.tsx";
import MembersPanel from "@/features/projects/components/MembersPanel.tsx";
import { useAuth } from '@/context/AuthContext.tsx';

export default function ProjectDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { data: project, loading, error, refetch } = useApi(() => projectsApi.get(id!), [id]);
    const [editOpen, setEditOpen] = useState(false);

    if (loading) return <p>Chargement...</p>;
    if (error || !project) return <p>Projet introuvable.</p>;

    const isOwner = project.owner.id === user?.id;
    const myRole = project.participants.find(p => p.user.id === user?.id)?.projectRole;
    const canWrite = isOwner || myRole === 'OWNER' || myRole === 'EDITOR';

    const handleDelete = async () => {
        if (!confirm('Supprimer ce projet ? Toutes les tâches associées seront supprimées.')) return;
        try {
            await projectsApi.delete(project.id);
            toast.success('Projet supprimé');
            navigate('/projects');
        } catch (e: any) {
            toast.error(e?.message ?? 'Erreur');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <Link to="/projects" className="text-sm text-blue-600 hover:underline">Mes projets</Link>
                    <h1 className="text-3xl font-bold mt-2">{project.name}</h1>
                    {project.description && <p className="text-gray-600 mt-1">{project.description}</p>}
                    <p className="text-sm text-gray-400 mt-1">Owner : {project.owner.username}</p>
                </div>
                {myRole !== "VIEWER" && (
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setEditOpen(true)}>Modifier</Button>
                        <Button variant="destructive" onClick={handleDelete}>Supprimer</Button>
                    </div>
                )}
            </div>

            <section>
                <h2 className="text-xl font-semibold mb-3">Tâches</h2>
                <TaskList projectId={project.id} canWrite={canWrite} />
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-3">Membres</h2>
                <MembersPanel project={project} onChange={refetch} />
            </section>

            <ProjectFormDialog open={editOpen} onOpenChange={setEditOpen} project={project}
                onSuccess={() => {
                    setEditOpen(false);
                    refetch();
                }}
            />
        </div>
    );
}