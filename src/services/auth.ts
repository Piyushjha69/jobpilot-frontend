import { api } from "../lib/api"
import { AuthResponse } from "../types/auth"

export const login = async (
    email: string,
    password: string
): Promise<AuthResponse> => {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
};

export const register = async (
    name: string,
    email: string,
    password: string
): Promise<AuthResponse | null> => {
    try {
        const res = await api.post("/auth/register", { name, email, password });
        return res.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        return null;
    }
};