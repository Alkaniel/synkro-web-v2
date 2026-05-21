import {api} from "@/api/client.ts";
import type {AuthResponse, UserResponse} from "@/types/api.ts";

export const authApi = {
    login: (body: { email: string, password: string }) =>
        api.post<AuthResponse>("/auth/login", body),

    register: (body: { username: string, email: string, password:string }) =>
        api.post<AuthResponse>("/auth/register", body),

    logout: () => api.post<void>("/auth/logout"),

    refresh: () => api.post<AuthResponse>("/auth/refresh"),

    me: () => api.get<UserResponse>("/users/me")
}