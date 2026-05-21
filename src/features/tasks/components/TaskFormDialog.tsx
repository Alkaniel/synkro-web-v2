import {useState, useEffect, type SyntheticEvent} from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { TaskResponse, TaskStatus, UserSummary } from '@/types/api';
import {tasksApi} from "@/api/task.ts";
import {projectsApi} from "@/api/projects.ts";
import {ApiError} from "@/api/errors.ts";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string;
    task?: TaskResponse;
    onSuccess: () => void;
}

export default function TaskFormDialog({ open, onOpenChange, projectId, task, onSuccess }: Props) {
    const isEdit = !!task;
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<TaskStatus>('TODO');
    const [dueDate, setDueDate] = useState('');
    const [assigneeEmails, setAssigneeEmails] = useState<string[]>([]);
    const [participants, setParticipants] = useState<UserSummary[]>([]);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setTitle(task?.title ?? '');
            setDescription(task?.description ?? '');
            setStatus(task?.status ?? 'TODO');
            setDueDate(task?.dueDate?.slice(0, 10) ?? '');
            setAssigneeEmails((task?.assignees ?? []).map(a => a.email));
            setFieldErrors({});

            projectsApi.get(projectId)
                .then(detail => setParticipants(detail.participants.map(p => p.user)))
                .catch(() => {});
        }
    }, [open, task, projectId]);

    const toggleAssignee = (email: string) => {
        setAssigneeEmails(prev =>
            prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
        );
    };

    const onSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        setLoading(true);
        setFieldErrors({});
        const dueDateISO = dueDate ? `${dueDate}T00:00:00` : undefined;
        try {
            if (isEdit) {
                await tasksApi.update(task!.id, {
                    title,
                    description: description || undefined,
                    status,
                    dueDate: dueDateISO,
                });
                await tasksApi.assign(task!.id, assigneeEmails);
            } else {
                await tasksApi.create(projectId, {
                    title,
                    description: description || undefined,
                    status,
                    dueDate: dueDateISO,
                    assigneeEmails,
                });
            }
            toast.success(isEdit ? 'Tâche mise à jour' : 'Tâche créée');
            onSuccess();
        } catch (err) {
            if (err instanceof ApiError) {
                if (err.isValidationError) setFieldErrors(err.fields ?? {});
                else toast.error(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <form onSubmit={onSubmit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>{isEdit ? 'Modifier la tâche' : 'Nouvelle tâche'}</DialogTitle>
                    </DialogHeader>

                    <div>
                        <Label htmlFor="title">Titre</Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        {fieldErrors.title && <p className="text-sm text-red-600 mt-1">{fieldErrors.title}</p>}
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>

                    <div>
                        <Label htmlFor="status">Statut</Label>
                        <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="TODO">À faire</SelectItem>
                                <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                                <SelectItem value="DONE">Terminé</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="dueDate">Échéance</Label>
                        <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                    </div>

                    {participants.length > 0 && (
                        <div>
                            <Label>Assignés</Label>
                            <div className="mt-1 max-h-36 overflow-y-auto border rounded p-2 space-y-1">
                                {participants.map(p => (
                                    <label key={p.id} className="flex items-center gap-2 cursor-pointer text-sm">
                                        <input
                                            type="checkbox"
                                            checked={assigneeEmails.includes(p.email)}
                                            onChange={() => toggleAssignee(p.email)}
                                            className="accent-primary"
                                        />
                                        <span>{p.username}</span>
                                        <span className="text-gray-400 text-xs">{p.email}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
