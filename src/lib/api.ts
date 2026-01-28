import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Attach access token 
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auto-refresh access token
api.interceptors.response.use(
    res => res,
    async (error) => {
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;

            const res = await api.post("/auth/refresh");
            localStorage.setItem("accessToken",res.data.accessToken);

            original.headers.authorization = `Bearer ${res.data.accessToken}`;

            return api(original);
        }

        return Promise.reject(error);
    }
);