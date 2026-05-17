export interface ApiErrorPayload {
    timestamp?: string;
    status: number;
    error?: string;
    message: string;
    path?: string;
    fields?: Record<string, string>;
}

export class ApiError extends Error {
    status: number
    fields?: Record<string, string>
    path?: string

    constructor(payload: ApiErrorPayload) {
        super(payload.message);
        this.name = "ApiError";
        this.status = payload.status;
        this.fields = payload.fields;
        this.path = payload.path;

        Object.setPrototypeOf(this, ApiError.prototype);
    }

    get isValidationError(): boolean {
        return this.status === 422 && !!this.fields
    }
}