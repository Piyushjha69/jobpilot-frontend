import { api } from "../lib/api";
import { ApiResponse } from "../types/api";

export interface Job {
    _id: string;
    title: string;
    company: string;
    location?: string;
    description: string;
    applyUrl: string;
    source: string;
    matchScore?: number;
    createdAt: string;
    updatedAt: string;
}

export interface JobFilters {
    keyword?: string;
    company?: string;
    location?: string;
}

export const getJobs = async (filters?: JobFilters): Promise<ApiResponse<Job[]>> => {
    try {
        const params = new URLSearchParams();
        if (filters?.keyword) params.append("keyword", filters.keyword);
        if (filters?.company) params.append("company", filters.company);
        if (filters?.location) params.append("location", filters.location);

        const res = await api.get<ApiResponse<Job[]>>(`/jobs?${params.toString()}`);
        return res.data;
    } catch (error: any) {
        if (error.response?.data) {
            return error.response.data;
        }
        return {
            success: false,
            statusCode: 500,
            message: "Failed to fetch jobs",
            error: error.message,
        };
    }
};

export const getMatchedJobs = async (): Promise<ApiResponse<Job[]>> => {
    try {
        const res = await api.get<ApiResponse<Job[]>>("/jobs/matched");
        return res.data;
    } catch (error: any) {
        if (error.response?.data) {
            return error.response.data;
        }
        return {
            success: false,
            statusCode: 500,
            message: "Failed to fetch matched jobs",
            error: error.message,
        };
    }
};

export const createJob = async (job: Omit<Job, "_id" | "createdAt" | "updatedAt" | "matchScore">): Promise<ApiResponse<Job>> => {
    try {
        const res = await api.post<ApiResponse<Job>>("/jobs", job);
        return res.data;
    } catch (error: any) {
        if (error.response?.data) {
            return error.response.data;
        }
        return {
            success: false,
            statusCode: 500,
            message: "Failed to create job",
            error: error.message,
        };
    }
};

export interface JobMatchAnalysis {
    overallScore: number;
    matchSummary: string;
    skillsMatch: {
        matched: string[];
        missing: string[];
        matchPercentage: number;
    };
    keywordsAnalysis: {
        found: string[];
        required: string[];
        matchPercentage: number;
    };
    recommendations: string[];
}

export const analyzeJobMatch = async (jobDescription: string): Promise<ApiResponse<JobMatchAnalysis>> => {
    try {
        const res = await api.post<ApiResponse<JobMatchAnalysis>>("/jobs/analyze", { jobDescription });
        return res.data;
    } catch (error: any) {
        if (error.response?.data) {
            return error.response.data;
        }
        return {
            success: false,
            statusCode: 500,
            message: "Failed to analyze job match",
            error: error.message,
        };
    }
};
