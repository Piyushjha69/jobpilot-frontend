import { api } from "../lib/api";
import { ApiResponse } from "../types/api";

export interface ResumeExperience {
    company: string;
    position: string;
    duration: string;
}

export interface Resume {
    _id: string;
    userId: string;
    name: string;
    text: string;
    email: string;
    skills: string[];
    experience: ResumeExperience[];
    createdAt: string;
    updatedAt: string;
}

export const getResume = async (): Promise<ApiResponse<Resume>> => {
    try {
        const res = await api.get<ApiResponse<Resume>>("/resume");
        return res.data;
    } catch (error: any) {
        if (error.response?.data) {
            return error.response.data;
        }
        return {
            success: false,
            statusCode: 500,
            message: "Failed to fetch resume",
            error: error.message,
        };
    }
};

export const uploadResume = async (file: File): Promise<ApiResponse<Resume>> => {
    try {
        const formData = new FormData();
        formData.append("resume", file);

        const res = await api.post<ApiResponse<Resume>>("/resume/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    } catch (error: any) {
        if (error.response?.data) {
            return error.response.data;
        }
        return {
            success: false,
            statusCode: 500,
            message: "Failed to upload resume",
            error: error.message,
        };
    }
};
