import { api } from './client';
import type { TaskResponse, TaskStatus } from '@/types/api';

interface TaskCreateBody {
    title: string;
    description?: string;
    status?: TaskStatus;
    dueDate?: string;
    assigneeEmails?: string[];
}

export const tasksApi = {
    listByProject: (projectId: string) =>
        api.get<TaskResponse[]>(`/projects/${projectId}/tasks`),
    get: (id: string) => api.get<TaskResponse>(`/tasks/${id}`),
    create: (projectId: string, body: TaskCreateBody) =>
        api.post<TaskResponse>(`/projects/${projectId}/tasks`, body),
    update: (id: string, body: Partial<TaskCreateBody>) =>
        api.put<TaskResponse>(`/tasks/${id}`, body),
    assign: (id: string, emails: string[]) =>
        api.post<TaskResponse>(`/tasks/${id}/assign`, { emails }),
    delete: (id: string) => api.delete<void>(`/tasks/${id}`),
};
