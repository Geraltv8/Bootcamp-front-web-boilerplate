import { useState, useEffect } from 'react';
import clientesAxios from '../config/axios';
import { toast } from 'sonner';

export const useFetch = (endpoint) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const respuesta = await clientesAxios.get(endpoint);
                setData(respuesta.data);

            } catch (error) {
                toast.error(`Error al cargar datos`);
                console.log(`ERROR: ${error.message}`);

            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [endpoint]);

    return { data, setData, isLoading };
}