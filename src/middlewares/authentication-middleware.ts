import { Request, Response, NextFunction } from "express";
import { StatusCodes as status } from "http-status-codes";
import {
    handleJwtError,
    verifyAccessToken,
    verifyRefreshToken,
} from "../utils/jwt.utils";
import { apiResponse } from "../utils/api-response";

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
