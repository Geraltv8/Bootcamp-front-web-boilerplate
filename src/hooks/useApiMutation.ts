import { useCallback, useState } from 'react';
import clientesAxios from '../config/axios';
import type { ApiResponse } from '../types/Api.type';

type HttpMethod = 'post' | 'patch' | 'delete';
type DynamicValue<TInput, TValue> = TValue | ((input: TInput) => TValue);

const resolveInputValue = <TInput, TValue>(value: DynamicValue<TInput, TValue>, input: TInput): TValue => (
    typeof value === 'function'
        ? (value as (input: TInput) => TValue)(input)
        : value
);

const useApiMutation = <TInput, TOutput>(
    method: DynamicValue<TInput, HttpMethod>,
    endpoint: DynamicValue<TInput, string>,
    sendBody = true,
    selectBody: (input: TInput) => unknown = (input) => input,
) => {
    const [isLoading, setIsLoading] = useState(false);

    const mutate = useCallback(async (input: TInput): Promise<TOutput> => {
        setIsLoading(true);
        try {
            const url = resolveInputValue(endpoint, input);
            const requestMethod = resolveInputValue(method, input);
            const body = sendBody ? selectBody(input) : undefined;
            const response = requestMethod === 'delete'
                ? await clientesAxios.delete<ApiResponse<TOutput>>(url)
                : requestMethod === 'post'
                    ? await clientesAxios.post<ApiResponse<TOutput>>(url, body)
                    : await clientesAxios.patch<ApiResponse<TOutput>>(url, body);
            return response.data.data;
        } finally {
            setIsLoading(false);
        }
    }, [endpoint, method, selectBody, sendBody]);

    return { mutate, isLoading };
};

export default useApiMutation;
