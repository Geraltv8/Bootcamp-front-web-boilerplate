import axios from 'axios';

const clientesAxios = axios.create({

    baseURL: (import.meta as ImportMeta & { env: { VITE_API_URL: string } }).env.VITE_API_URL,

    headers: {
        'Content-Type': 'application/json'
    }
});

export default clientesAxios;