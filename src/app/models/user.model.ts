export interface User {
    id?: number;
    username: string;
    password?: string;
    role: UserRole;
    active?: boolean;
}

export enum UserRole {
    ADMIN = 'ADMIN',
    CAMARERO = 'CAMARERO',
    COCINERO = 'COCINERO'
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface LoginRequest {
    username: string;
    password: string;
}
