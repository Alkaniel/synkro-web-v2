// ----------User------------

export type UserRole = "ROLE_USER" | "ROLE_ADMIN";

export interface UserSummary {
    id: string
    username: string
    email: string
}

export interface UserResponse {
    id: string
    email: string
    username: string
    role: UserRole
    createdAt: string
}

// ----------Auth------------

export interface AuthResponse {
    accessToken: string,
}

// ------------Project------------

export type ProjectRole = 'OWNER' | 'EDITOR' | 'VIEWER';

export interface ProjectResponse {
    id: string;
    name: string;
    description: string | null;
    avatarUrl: string | null;
    owner: UserSummary;
}

export interface ParticipantResponse {
    user: UserSummary;
    projectRole: ProjectRole;
}

export interface ProjectDetailResponse extends ProjectResponse {
    participants: ParticipantResponse[];
}

// ------------Task------------

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface TaskResponse {
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    dueDate: string | null;
    projectId: string;
    assignees: UserSummary[];
}

// ------------Erreurs------------

export interface ApiErrorResponse {
    timestamp: string;
    status: number;
    error: string;
    message: string;
    path: string;
    fields?: Record<string, string>;
}