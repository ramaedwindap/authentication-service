import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { NextFunction, Request, Response } from "express";
import { StatusCodes as status } from "http-status-codes";
import { apiResponse } from "../utils/api-response";

export const errorMiddleware = async (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (err instanceof PrismaClientValidationError) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(
                apiResponse(
                    status.INTERNAL_SERVER_ERROR,
                    "INTERNAL_SERVER_ERROR",
                    "An unexpected error occurred."
                )
            );
    } else {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(
                apiResponse(
                    status.INTERNAL_SERVER_ERROR,
                    "INTERNAL_SERVER_ERROR",
                    err.message
                )
            );
    }
};
