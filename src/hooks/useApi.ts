import {useCallback, useEffect, useRef, useState} from "react";
import {ApiError} from "@/api/errors.ts";


/**
 * GET Hooks : automatic mount fetch, refetch only on deps.
 *
 * Usage:
 *   const { data, error, loading, refetch } = useApi(() => api.get('/projects'), []);
 */
export function useApi<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<ApiError | null>(null);
    const [loading, setLoading] = useState(true);

    const fetcherRef = useRef(fetcher);
    fetcherRef.current = fetcher;

    const refetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetcherRef.current();
            setData(result);
        } catch (e) {
            setError(
                e instanceof ApiError ? e : new ApiError({ status: 0, message: 'Something went wrong' })
            );
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { data, error, loading, refetch };
}

