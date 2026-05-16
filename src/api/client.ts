const BASE_URL = import.meta.env.VITE_API_URL;

let accessTokenInMemory: string | null = null;

export const setApiToken = (token: string | null) => {
    accessTokenInMemory = token;
}

async function apiRequest<T>(endpoint: string, {body, ...customConfig }: any = {}): Promise<T> {
    const token = accessTokenInMemory;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
        method: body ? 'POST' : 'GET',
        credentials: "include",
        ...customConfig,
        headers: {
            ...headers,
            ...customConfig.headers
        }
    }

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP Error : ${response.status}`);
    }

    if (response.status === 204) return {} as T;

    return response.json();
}

export const api = {
    get: <T>(endpoint: string, config?: RequestInit): Promise<T> =>
        apiRequest(endpoint, { ...config, method: 'GET' }),

    post: <T>(endpoint: string, body: any, config?: RequestInit): Promise<T>  =>
        apiRequest(endpoint, { ...config, method: 'POST' , body}),

    put: <T>(endpoint: string, body: any, config?: RequestInit): Promise<T>  =>
        apiRequest(endpoint, { ...config, method: 'PUT' , body}),

    patch: <T>(endpoint: string, body: any, config?: RequestInit): Promise<T> =>
        apiRequest(endpoint, { ...config, method: 'PATCH', body}),

    delete: <T>(endpoint: string, config?: RequestInit): Promise<T> =>
        apiRequest(endpoint, { ...config, method: 'DELETE' }),
}
