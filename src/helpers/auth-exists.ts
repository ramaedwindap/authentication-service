import Joi from "joi";
import { prismaClient } from "../application/database";

const customThrowErrorJoiString = (msg: string, field: string): never => {
    throw new Joi.ValidationError(
        msg,
        [
            {
                message: msg,
                path: [field],
                type: `string.${field}`,
                context: {
                    key: field,
                    label: field,
                    field,
                },
            },
        ],
        field
    );
};

export const isUsernameExistsJoi = async (
    username: string
): Promise<boolean> => {
    const user = await prismaClient.user.findUnique({ where: { username } });
    if (user)
        customThrowErrorJoiString("Username already been taken", "username");

    return true;
};

export const isEmailExistsJoi = async (email: string): Promise<boolean> => {
    const user = await prismaClient.user.findUnique({ where: { email } });
    if (user) customThrowErrorJoiString("Email already been taken", "email");

    return true;
};
