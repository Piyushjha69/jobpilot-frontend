import { api } from "../lib/api";
import { ApiResponse } from "../types/api";

export interface Application {
    _id: string;
    jobId: string;
    jobTitle: string;
    company: string;
    jobUrl: string;
    resumeId: string;
    matchScore: number;
    matchSummary: string;
    status: "SAVED" | "APPLIED" | "INTERVIEW" | "REJECTED" | "OFFER";
    appliedAt?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface ApplicationStats {
    totalApplications: number;
    interviews: number;
    avgMatchScore: number;
    thisWeek: number;
}

export interface CreateApplicationInput {
    jobId: string;
    jobTitle: string;
    company: string;
    jobUrl: string;
    resumeId: string;
}

export const getApplications = async (): Promise<ApiResponse<Application[]>> => {
    try {
        const res = await api.get<ApiResponse<Application[]>>("/applications");
        return res.data;
    } catch (error: any) {
        if (error.response?.data) {
            return error.response.data;
        }
        return {
            success: false,
            statusCode: 500,
            message: "Failed to fetch applications",
            error: error.message,
        };
    }
};

export const getApplicationStats = async (): Promise<ApiResponse<ApplicationStats>> => {
    try {
        const res = await api.get<ApiResponse<ApplicationStats>>("/applications/stats");
        return res.data;
    } catch (error: any) {
        if (error.response?.data) {
            return error.response.data;
        }
        return {
            success: false,
            statusCode: 500,
            message: "Failed to fetch stats",
            error: error.message,
        };
    }
};

export const createApplication = async (
    input: CreateApplicationInput
): Promise<ApiResponse<Application>> => {
    try {
        const res = await api.post<ApiResponse<Application>>("/applications", input);
        return res.data;
    } catch (error: any) {
        if (error.response?.data) {
            return error.response.data;
        }
        return {
            success: false,
            statusCode: 500,
            message: "Failed to create application",
            error: error.message,
        };
    }
};

export const updateApplicationStatus = async (
    id: string,
    status: Application["status"]
): Promise<ApiResponse<Application>> => {
    try {
        const res = await api.patch<ApiResponse<Application>>(`/applications/${id}/status`, { status });
        return res.data;
    } catch (error: any) {
        if (error.response?.data) {
            return error.response.data;
        }
        return {
            success: false,
            statusCode: 500,
            message: "Failed to update status",
            error: error.message,
        };
    }
};
