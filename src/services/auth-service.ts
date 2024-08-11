import {
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    UserResponse,
} from "../models/user-model";
import { ApiResponse, apiResponse } from "../utils/api-response";
import { StatusCodes as status } from "http-status-codes";
import { comparePassword, hashPassword } from "../utils/bycript";
import { prismaClient } from "../application/database";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.utils";

export class AuthService {
    private static readonly INVALID_CREDENTIALS_MESSAGE =
        "These credentials do not match our records";

    static async register(request: RegisterRequest): Promise<ApiResponse> {
        const { username, email, password, is_active, created_at } = request;

        const hashedPassword = await hashPassword(password);

        const userModel = await prismaClient.user.create({
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
            AuthResponse(userModel)
        );
    }

    static async login(request: LoginRequest): Promise<ApiResponse> {
        const { email, password } = request;

        const userModel = await prismaClient.user.findUnique({
            where: {
                email,
                is_active: true,
            },
        });

        const isInvalidCredentials =
            !userModel ||
            !(await comparePassword(password, userModel.password));

        if (isInvalidCredentials) {
            return apiResponse(
                status.BAD_REQUEST,
                "BAD_REQUEST",
                AuthService.INVALID_CREDENTIALS_MESSAGE
            );
        }

        const user: UserResponse = AuthResponse(userModel);

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        return apiResponse(status.OK, "OK", "Success login", {
            user,
            accessToken,
            refreshToken,
        });
    }

    static async getProfile(request: UserResponse): Promise<ApiResponse> {
        const { uuid } = request;
        const userModel = await prismaClient.user.findUnique({
            where: {
                uuid,
                is_active: true,
            },
        });

        if (!userModel)
            return apiResponse(status.NOT_FOUND, "NOT_FOUND", "User not found");

        return apiResponse(
            status.OK,
            "OK",
            "Success get user",
            AuthResponse(userModel)
        );
    }

    static async refreshToken(request: UserResponse): Promise<ApiResponse> {
        const { uuid } = request;

        const userModel = await prismaClient.user.findUnique({
            where: {
                uuid,
                is_active: true,
            },
        });

        if (!userModel)
            return apiResponse(status.NOT_FOUND, "NOT_FOUND", "User not found");

        const user: UserResponse = AuthResponse(userModel);

        const accessToken = generateAccessToken(user);

        return apiResponse(status.OK, "OK", "Success generate access token", {
            accessToken,
        });
    }
}
