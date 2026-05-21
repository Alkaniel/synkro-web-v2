import { api } from './client';
import type { UserResponse } from '@/types/api';

export const usersApi = {
    me: () => api.get<UserResponse>('/users/me'),

    update: (body: { username?: string; email?: string; password?: string }) =>
        api.patch<UserResponse>('/users/me', body),

    deleteMe: () => api.delete<void>('/users/me'),

    updatePassword: (body: { currentPassword: string; newPassword: string}) => api.patch<void>("/users/me/password", body)
};