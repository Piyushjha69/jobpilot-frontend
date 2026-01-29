export interface User {
    id: string;
    name: string;
    email: string;
}

export interface AuthData {
    accessToken: string;
    refreshToken: string;
    user: User;
}
