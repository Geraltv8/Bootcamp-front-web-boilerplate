import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import clientesAxios from '../config/axios';
import type { ApiResponse } from '../types/Api.type';
import getApiErrorMessage from './getApiErrorMessage';

const useApiQuery = <T,>(endpoint: string | null) => {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(endpoint !== null);
    const [error, setError] = useState<string | null>(null);

    const reload = useCallback(async (signal?: AbortSignal) => {
        if (!endpoint) {
            setData(null);
            setError(null);
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const response = await clientesAxios.get<ApiResponse<T>>(endpoint, { signal });
            setData(response.data.data);
        } catch (requestError: unknown) {
            if (axios.isCancel(requestError)) return;
            const message = getApiErrorMessage(requestError, 'No se pudieron cargar los datos.');
            setError(message);
            if (!axios.isAxiosError(requestError) || requestError.response?.status !== 404) {
                toast.error(message);
            }
        } finally {
            if (!signal?.aborted) setIsLoading(false);
        }
    }, [endpoint]);

    useEffect(() => {
        setData(null);
        setError(null);
        if (!endpoint) {
            setIsLoading(false);
            return;
        }
        const controller = new AbortController();
        void reload(controller.signal);
        return () => controller.abort();
    }, [endpoint, reload]);

    return { data, isLoading, error, reload, setData };
};

export default useApiQuery;
