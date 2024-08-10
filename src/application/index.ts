import bodyParser from "body-parser";
import express, { NextFunction, Request, Response } from "express";
import { routes } from "../routes";
import { StatusCodes as status } from "http-status-codes";
import { apiResponse } from "../utils/api-response";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { errorMiddleware } from "../middlewares/error-middleware";

export const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", routes);

app.get("/", (_req: Request, res: Response) =>
    res.status(status.OK).json(apiResponse(status.OK, "OK", "Welcome to app."))
);

app.use((_req: Request, res: Response) =>
    res
        .status(status.NOT_FOUND)
        .json(
            apiResponse(
                status.NOT_FOUND,
                "NOT_FOUND",
                "The requested resource could not be found."
            )
        )
);

app.use(errorMiddleware);
