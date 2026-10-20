import axios from 'axios';
import type { ApiResponse } from '../types/Api.type';

const getApiErrorMessage = (error: unknown, fallback: string): string => {
    if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
        return error.response?.data?.message ?? fallback;
    }
    return error instanceof Error ? error.message : fallback;
};

export default getApiErrorMessage;
