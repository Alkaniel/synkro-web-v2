import { api } from './client';
import type { ProjectResponse, ProjectDetailResponse } from '@/types/api';

export const projectsApi = {
    list: () => api.get<ProjectResponse[]>('/projects'),

    get: (id: string) => api.get<ProjectDetailResponse>(`/projects/${id}`),

    create: (body: { name: string; description?: string }) =>
        api.post<ProjectResponse>('/projects', body),

    update: (id: string, body: { name?: string; description?: string }) =>
        api.put<ProjectResponse>(`/projects/${id}`, body),

    delete: (id: string) => api.delete<void>(`/projects/${id}`),

    transferOwnership: (id: string, newOwnerEmail: string) =>
        api.patch<ProjectResponse>(`/projects/${id}/transfer`, { newOwnerEmail }),

    uploadAvatar: (id: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post<ProjectResponse>(`/projects/${id}/avatar`, formData, { multipart: true });
    },

    listMembers: (id: string) => api.get(`/projects/${id}/members`),

    addMember: (id: string, body: { email: string, role: 'EDITOR' | 'VIEWER' }) =>
        api.post(`/projects/${id}/members`, body),

    updateMemberRole: (id: string, email: string, role: 'EDITOR' | 'VIEWER') =>
        api.patch(`/projects/${id}/members`, {email, role }),

    removeMember: (id: string, userId: string) =>
        api.delete(`/projects/${id}/members/${userId}`),
};