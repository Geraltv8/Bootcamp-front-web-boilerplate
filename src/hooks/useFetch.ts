import { useState, useEffect } from 'react';
import clientesAxios from '../config/axios';
import { toast } from 'sonner';

export const useFetch = <T>(endpoint: string) => {
    const [response, setResponse] = useState<{ data: T } | null>(null);
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const respuesta = await clientesAxios.get<{data: T}>(endpoint);
                setResponse(respuesta.data);
                setData(respuesta.data.data);
                console.log(`${respuesta.data.data}`)

            } catch (error: any) {
                toast.error(`Error al cargar datos`);
                console.log(`ERROR: ${error.message}`);

            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [endpoint]);

    return { response, data, setData, isLoading };
}