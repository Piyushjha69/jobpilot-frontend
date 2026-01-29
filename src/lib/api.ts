import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Attach access token
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Handle 401 errors - redirect to login if token invalid
api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config;

        // If 401 and we haven't already retried
        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;

            // Try to refresh the token
            const refreshToken = typeof window !== "undefined" 
                ? localStorage.getItem("refreshToken") 
                : null;

            if (refreshToken) {
                try {
                    const res = await axios.post(
                        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
                        { refreshToken }
                    );

                    if (res.data?.success && res.data?.data?.accessToken) {
                        localStorage.setItem("accessToken", res.data.data.accessToken);
                        original.headers.Authorization = `Bearer ${res.data.data.accessToken}`;
                        return api(original);
                    }
                } catch (refreshError) {
                    // Refresh failed, clear tokens and redirect to login
                    if (typeof window !== "undefined") {
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("refreshToken");
                        window.location.href = "/login";
                    }
                    return Promise.reject(refreshError);
                }
            } else {
                // No refresh token, redirect to login
                if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    window.location.href = "/login";
                }
            }
        }

        return Promise.reject(error);
    }
);
