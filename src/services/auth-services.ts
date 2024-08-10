import { AuthResponse, RegisterRequest } from "../models/user-model";
import { ApiResponse, apiResponse } from "../utils/api-response";
import { StatusCodes as status } from "http-status-codes";
import { hashPassword } from "../utils/bycript";
import { prismaClient } from "../application/database";

export class AuthService {
    static async register(request: RegisterRequest): Promise<ApiResponse> {
        // try {
        const { username, email, password, is_active, created_at } = request;

        const hashedPassword = await hashPassword(password);

        const user = await prismaClient.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                is_active,
                created_at,
            },
        });

        return apiResponse(
            status.CREATED,
            "CREATED",
            "Success create an account",
            AuthResponse(user)
        );
        // } catch (e: any) {
        //     throw apiResponse(
        //         e.code || status.INTERNAL_SERVER_ERROR,
        //         e.status || "INTERNAL_SERVER_ERROR",
        //         e.message
        //     );
        // }
    }
}
