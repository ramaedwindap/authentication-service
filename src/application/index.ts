import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import { routes } from "../routes";
import { StatusCodes as status } from "http-status-codes";
import { apiResponse } from "../utils/api-response";
import { errorMiddleware } from "../middlewares/error-middleware";
import { notFoundRequest } from "../middlewares/not-found";
import morgan from "morgan";
import compression from "compression";
import helmet from "helmet";

export const app = express();

app.use(compression());

app.use(helmet());

app.use(express.json());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.use("/api", routes);

app.get("/", (_req: Request, res: Response) =>
    res.status(status.OK).json(apiResponse(status.OK, "OK", "Hello World! 🚀"))
);

app.use(notFoundRequest);

app.use(errorMiddleware);
