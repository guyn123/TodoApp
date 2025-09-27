import axios from 'axios';

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use((config) => {
    const authStorage = localStorage.getItem('auth-storage');
    let token = null;
    if (authStorage) {
        const parsed = JSON.parse(authStorage);
        token = parsed.state?.token;
    }
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosClient;