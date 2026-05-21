import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import { tasksApi } from "@/api/task.ts";
import type { TaskStatus } from '@/types/api.ts';
import TaskCard from "@/features/tasks/components/TaskCard.tsx";
import TaskFormDialog from "@/features/tasks/components/TaskFormDialog.tsx";

type Filter = TaskStatus | 'ALL';

const filters: { value: Filter; label: string }[] = [
    { value: 'ALL', label: 'Toutes' },
    { value: 'TODO', label: 'À faire' },
    { value: 'IN_PROGRESS', label: 'En cours' },
    { value: 'DONE', label: 'Terminées' },
];

export default function TaskList({ projectId, canWrite }: { projectId: string; canWrite: boolean }) {
    const { data: tasks, loading, refetch } = useApi(
        () => tasksApi.listByProject(projectId),
        [projectId]
    );
    const [createOpen, setCreateOpen] = useState(false);
    const [filter, setFilter] = useState<Filter>('ALL');

    if (loading) return <p>Chargement des tâches...</p>;

    const visible = filter === 'ALL' ? tasks : tasks?.filter(t => t.status === filter);

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex gap-1">
                    {filters.map(f => (
                        <button
                            key={f.value}
                            onClick={() => setFilter(f.value)}
                            className={`px-3 py-1 rounded text-sm transition-colors ${
                                filter === f.value
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {f.label}
                            {tasks && (
                                <span className="ml-1 opacity-60">
                                    ({f.value === 'ALL' ? tasks.length : tasks.filter(t => t.status === f.value).length})
                                </span>
                            )}
                        </button>
                    ))}
                </div>
                {canWrite && <Button onClick={() => setCreateOpen(true)} size="sm">+ Nouvelle tâche</Button>}
            </div>

            {visible && visible.length === 0 && (
                <p className="text-gray-500">Aucune tâche{filter !== 'ALL' ? ' pour ce statut' : ''}.</p>
            )}

            <ul className="space-y-2">
                {visible?.map((t) => (
                    <TaskCard key={t.id} task={t} onChange={refetch} canWrite={canWrite} />
                ))}
            </ul>

            <TaskFormDialog open={createOpen} onOpenChange={setCreateOpen} projectId={projectId}
                onSuccess={() => {
                    setCreateOpen(false);
                    refetch();
                }}
            />
        </div>
    );
}