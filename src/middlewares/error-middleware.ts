import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { NextFunction, Request, Response } from "express";
import { StatusCodes as status } from "http-status-codes";
import { apiResponse } from "../utils/api-response";

export const errorMiddleware = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    const errorMessage =
        err instanceof PrismaClientValidationError
            ? "An unexpected error occurred."
            : err.message;

    return res
        .status(status.INTERNAL_SERVER_ERROR)
        .json(
            apiResponse(
                status.INTERNAL_SERVER_ERROR,
                "INTERNAL_SERVER_ERROR",
                errorMessage
            )
        );
};
