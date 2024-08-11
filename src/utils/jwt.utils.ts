import jwt, {
    JsonWebTokenError,
    JwtPayload,
    TokenExpiredError,
} from "jsonwebtoken";
import { StatusCodes as status } from "http-status-codes";
import { UserResponse } from "../models/user-model";
import { apiResponse } from "./api-response";
import { Response } from "express";

export const generateAccessToken = (payload: UserResponse): string => {
    const { uuid, username, email, provider } = payload;
    return jwt.sign(
        { uuid, username, email, provider },
        process.env.ACCESS_TOKEN_SECRET_KEY as string,
        { expiresIn: "15m" }
    );
};

export const generateRefreshToken = (payload: UserResponse): string => {
    const { uuid, username, email, provider } = payload;
    return jwt.sign(
        { uuid, username, email, provider },
        process.env.REFRESH_TOKEN_SECRET_KEY as string,
        { expiresIn: "1d" }
    );
};

export const verifyAccessToken = (token: string): JwtPayload | string => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY as string);
};

export const verifyRefreshToken = (token: string): JwtPayload | string => {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY as string);
};

export const handleJwtError = (error: any, res: Response): Response => {
    if (error instanceof TokenExpiredError) {
        return res
            .status(status.UNAUTHORIZED)
            .json(
                apiResponse(
                    status.UNAUTHORIZED,
                    "UNAUTHORIZED",
                    "Token expired. Please login again."
                )
            );
    }

    if (error instanceof JsonWebTokenError) {
        return res
            .status(status.UNAUTHORIZED)
            .json(
                apiResponse(
                    status.UNAUTHORIZED,
                    "UNAUTHORIZED",
                    "Invalid token. Please login again."
                )
            );
    }

    return res
        .status(status.INTERNAL_SERVER_ERROR)
        .json(
            apiResponse(
                status.INTERNAL_SERVER_ERROR,
                "INTERNAL_SERVER_ERROR",
                error.message || "Internal Server Error"
            )
        );
};
