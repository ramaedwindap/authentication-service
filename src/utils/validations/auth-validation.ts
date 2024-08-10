import { NextFunction, Request, Response } from "express";
import { StatusCodes as status } from "http-status-codes";
import Joi, { ObjectSchema } from "joi";
import passwordComplexity from "joi-password-complexity";
import { apiResponseValidationError } from "../api-response";
import {
    isEmailExistsJoi,
    isUsernameExistsJoi,
} from "../../helpers/auth-exists";

const options = {
    abortEarly: false,
    errors: {
        wrap: {
            label: "",
        },
    },
};

export const registerValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const schema: ObjectSchema = Joi.object({
        username: Joi.string()
            .max(255)
            .required()
            .regex(/^[a-zA-Z0-9-_]+$/)
            .label("Username")
            .external(async (username) => isUsernameExistsJoi(username))
            .options({
                messages: {
                    "string.pattern.base":
                        "Username must only contains alphanumeric, dash, and underscore",
                },
            }),
        email: Joi.string()
            .email()
            .max(255)
            .required()
            .label("Email")
            .external(async (email) => isEmailExistsJoi(email)),
        password: passwordComplexity().required().label("Password"),
        password_confirmation: Joi.any()
            .valid(Joi.ref("password"))
            .required()
            .label("Password Confirmation")
            .options({
                messages: {
                    "any.only": "Password and {{#label}} does not match",
                },
            }),
        is_active: Joi.boolean().required(),
        created_at: Joi.date().required(),
    });

    try {
        await schema.validateAsync(req.body, options);
        next();
    } catch (e: any) {
        return res
            .status(status.UNPROCESSABLE_ENTITY)
            .json(apiResponseValidationError(e));
    }
};

export const loginValidation = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const schema: ObjectSchema = Joi.object({
        email: Joi.string().email().max(255).required().label("Email"),
        password: Joi.string().required().label("Password"),
    });

    const { error } = schema.validate(req.body, options);
    if (error) {
        return res
            .status(status.UNPROCESSABLE_ENTITY)
            .json(apiResponseValidationError(error));
    }

    next();
};
