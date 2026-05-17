import {ApiError, type ApiErrorPayload} from "@/api/errors.ts";

const BASE_URL = import.meta.env.VITE_API_URL;

let accessTokenInMemory: string | null = null;

export const setApiToken = (token: string | null) => {
    accessTokenInMemory = token;
}

interface RequestConfig extends Omit<RequestInit, "body"> {
    body?: unknown;
    multipart?: boolean;
}

async function apiRequest<T>(endpoint: string, {body, multipart, headers, ...customConfig }: RequestConfig = {}): Promise<T> {

    const finalHeaders: Record<string, string> = {
        ...(multipart ? {} : { "Content-Type": "application/json" }),
        ...(accessTokenInMemory ? { Authorization: `Bearer ${accessTokenInMemory}` } : {}),
        ...(headers as Record<string, string>),
    };

    const config: RequestInit = {
        ...customConfig,
        credentials: "include",
        headers: finalHeaders,
    };

    if (body !== undefined) {
        config.body = multipart ? (body as BodyInit) : JSON.stringify(body);
    }

    let response: Response;
    try {
        response = await fetch(`${BASE_URL}${endpoint}`, config);
    } catch {
        throw new ApiError({
            status: 0,
            message: "Network error, please check your connection.",
        });
    }

    if (response.status === 204) return undefined as T;

    const isJson = (response.headers.get("content-type") ?? "").includes("application/json");

    if (!response.ok) {
        if (isJson) {
            const payload = (await response.json()) as ApiErrorPayload;
            throw new ApiError(payload);
        }
        throw new ApiError({
            status: response.status,
            message: response.statusText || "Erreur inconnue",
        });
    }

    return isJson ? ((await response.json()) as T) : (undefined as T);
}

export const api = {
    get: <T>(endpoint: string, config?: RequestConfig): Promise<T> =>
        apiRequest<T>(endpoint, { ...config, method: "GET" }),

    post: <T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> =>
        apiRequest<T>(endpoint, { ...config, method: "POST", body }),

    put: <T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> =>
        apiRequest<T>(endpoint, { ...config, method: "PUT", body }),

    patch: <T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> =>
        apiRequest<T>(endpoint, { ...config, method: "PATCH", body }),

    delete: <T>(endpoint: string, config?: RequestConfig): Promise<T> =>
        apiRequest<T>(endpoint, { ...config, method: "DELETE" }),
}
