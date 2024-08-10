import { StatusCodes } from "http-status-codes";
import { ValidationError } from "joi";
import { logger } from "../application/logging";

const errorsCustomMessage = (errors: ValidationError): Record<string, string> =>
    errors.details.reduce(
        (acc, curr) => ({
            ...acc,
            [curr.path.join(".")]: curr.message,
        }),
        {} as Record<string, string>
    );

export interface ApiResponse<T = any> {
    code: number;
    status: string;
    message: string;
    data?: T;
    errors?: Record<string, string>;
}

export const apiResponse = <T = any>(
    code: number = StatusCodes.OK,
    status: string = "OK",
    message: string,
    data?: T
): ApiResponse<T> => {
    logger.info({ code, status, message, data });
    return { code, status, message, data };
};

export const apiResponseValidationError = (
    errors: ValidationError
): ApiResponse => {
    return {
        code: StatusCodes.UNPROCESSABLE_ENTITY,
        status: "UNPROCESSABLE_ENTITY",
        message: "The given data was invalid.",
        errors: errorsCustomMessage(errors),
    };
};
