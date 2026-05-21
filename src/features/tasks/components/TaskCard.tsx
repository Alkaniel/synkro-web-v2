import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import type { TaskResponse } from '@/types/api';
import {tasksApi} from "@/api/task.ts";
import TaskFormDialog from "@/features/tasks/components/TaskFormDialog.tsx";

const statusLabels: Record<TaskResponse['status'], string> = {
    TODO: 'À faire',
    IN_PROGRESS: 'En cours',
    DONE: 'Terminé',
};

export default function TaskCard({ task, onChange, canWrite }: { task: TaskResponse; onChange: () => void; canWrite: boolean }) {
    const [editOpen, setEditOpen] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Supprimer cette tâche ?')) return;
        try {
            await tasksApi.delete(task.id);
            toast.success('Tâche supprimée');
            onChange();
        } catch (e: any) {
            toast.error(e?.message ?? 'Erreur');
        }
    };

    return (
        <li className="bg-white p-3 rounded border flex items-start justify-between">
            <div>
                <h3 className="font-medium">{task.title}</h3>
                {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
                <div className="flex gap-2 mt-2 text-xs">
                    <span className="bg-gray-100 px-2 py-1 rounded">{statusLabels[task.status]}</span>
                    {task.dueDate && <span className="text-gray-500">Échéance : {new Date(task.dueDate).toLocaleDateString()}</span>}
                    {task.assignees.length > 0 && (
                        <span className="text-gray-500">Assigné à : {task.assignees.map(a => a.username).join(', ')}</span>
                    )}
                </div>
            </div>
            {canWrite && (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setEditOpen(true)}>Modifier</Button>
                    <Button variant="ghost" size="sm" onClick={handleDelete}>Supprimer</Button>
                </div>
            )}

            <TaskFormDialog open={editOpen} onOpenChange={setEditOpen} projectId={task.projectId} task={task}
                onSuccess={() => {
                    setEditOpen(false);
                    onChange();
                }}
            />
        </li>
    );
}