import { Request, Response, NextFunction } from "express";
import { StatusCodes as status } from "http-status-codes";
import { verifyAccessToken, verifyRefreshToken } from "../utils/jwt.utils";
import { apiResponse } from "../utils/api-response";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

const handleJwtError = (error: any, res: Response): Response => {
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

export const authentication = (
    req: Request,
    res: Response,
    next: NextFunction
): void | Response => {
    try {
        const bearer = req.headers.authorization;
        if (!bearer) {
            return res
                .status(status.UNAUTHORIZED)
                .json(
                    apiResponse(
                        status.UNAUTHORIZED,
                        "UNAUTHORIZED",
                        "Unauthorized. Please login to continue."
                    )
                );
        }

        const token = bearer.split(" ")[1];

        if (!token) {
            return res
                .status(status.UNAUTHORIZED)
                .json(
                    apiResponse(
                        status.UNAUTHORIZED,
                        "UNAUTHORIZED",
                        "Unauthorized. Please login to continue."
                    )
                );
        }

        req.user = verifyAccessToken(token);

        next();
    } catch (error: any) {
        return handleJwtError(error, res);
    }
};

export const refreshToken = (
    req: Request,
    res: Response,
    next: NextFunction
): void | Response => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res
                .status(status.BAD_REQUEST)
                .json(
                    apiResponse(
                        status.BAD_REQUEST,
                        "BAD_REQUEST",
                        "Refresh token is required"
                    )
                );
        }

        req.user = verifyRefreshToken(refreshToken);

        next();
    } catch (error: any) {
        return handleJwtError(error, res);
    }
};
