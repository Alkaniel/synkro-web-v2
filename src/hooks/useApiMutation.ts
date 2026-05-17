import {useCallback, useState} from "react";
import {ApiError} from "@/api/errors.ts";

/**
 * Manual mutation hooks (POST/PUT/PATCH/DELETE).
 *
 * Usage:
 *   const { mutate, loading, error } = useApiMutation<ProjectResponse, { name: string }>();
 *   await mutate((values) => api.post('/projects', values), { name: 'My project' });
 */
export function useApiMutation<TResult, TInput = void>() {
    const [data, setData] = useState<TResult | null>(null);
    const [error, setError] = useState<ApiError | null>(null);
    const [loading, setLoading] = useState(false);

    const mutate = useCallback(
        async (
            fn: (input: TInput) => Promise<TResult>,
            input: TInput
        ): Promise<TResult | null> => {
            setLoading(true);
            setError(null);
            try {
                const result = await fn(input);
                setData(result);
                return result;
            } catch (e) {
                const apiError =
                    e instanceof ApiError ? e : new ApiError({ status: 0, message: 'Something went wrong' });
                setError(apiError);
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
    }, []);

    return { data, error, loading, mutate, reset };
}