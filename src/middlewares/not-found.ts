import { apiResponse } from "../utils/api-response";
import { Request, Response } from "express";
import { StatusCodes as status } from "http-status-codes";

export const notFoundRequest = (_req: Request, res: Response) => {
    return res
        .status(status.NOT_FOUND)
        .json(
            apiResponse(
                status.NOT_FOUND,
                "NOT_FOUND",
                "The requested resource could not be found."
            )
        );
};
