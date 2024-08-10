import { User } from "@prisma/client";

export type UserResponse = {
    uuid: string;
    username: string;
    email: string;
    provider: string;
    is_active: boolean;
    provider_id?: string;
    created_at?: string;
    updated_at?: string;
};

export type RegisterRequest = {
    username: string;
    email: string;
    password: string;
    is_active: boolean;
    created_at: string;
};

export type LoginRequest = {
    email: string;
    password: string;
};

export function AuthResponse(user: User): UserResponse {
    return {
        uuid: user.uuid,
        username: user.username,
        email: user.email,
        provider: user.provider,
        is_active: user.is_active,
    };
}
