import { api } from "../lib/api";
import { ApiResponse } from "../types/api";
import { AuthData, User } from "../types/auth";

export const login = async (
    email: string,
    password: string
): Promise<ApiResponse<AuthData>> => {
    try {
        const res = await api.post<ApiResponse<AuthData>>("/auth/login", { email, password });
        return res.data;
    } catch (error: any) {
        if (error.response?.data) {
            return error.response.data;
        }
        return {
            success: false,
            statusCode: 500,
            message: "Network error. Please try again.",
            error: error.message,
        };
    }
};

export const register = async (
    name: string,
    email: string,
    password: string
): Promise<ApiResponse<AuthData>> => {
    try {
        const res = await api.post<ApiResponse<AuthData>>("/auth/register", { name, email, password });
        return res.data;
    } catch (error: any) {
        if (error.response?.data) {
            return error.response.data;
        }
        return {
            success: false,
            statusCode: 500,
            message: "Network error. Please try again.",
            error: error.message,
        };
    }
};

export const getProfile = async (): Promise<ApiResponse<User>> => {
    try {
        const res = await api.get<ApiResponse<User>>("/auth/profile");
        return res.data;
    } catch (error: any) {
        if (error.response?.data) {
            return error.response.data;
        }
        return {
            success: false,
            statusCode: 500,
            message: "Failed to fetch profile",
            error: error.message,
        };
    }
};
