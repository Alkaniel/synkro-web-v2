import {api} from "@/api/client.ts";
import type {UserResponse, UserRole} from "@/types/api.ts";

export const adminApi = {
    listUsers: () => api.get<UserResponse[]>("/admin/users"),

    changeRole: (id: string, role: UserRole) => api.patch<UserResponse>(`/admin/users/${id}/role`, {
        role: role.replace("ROLE_", "")
    }),

    deleteUser: (id: string) => api.delete<void>(`/admin/users/${id}`)
}