export interface User {
    id: string;
    name: string;
    email: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
    status: number;
    message: string;
}