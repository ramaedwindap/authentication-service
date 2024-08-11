import jwt, { JwtPayload } from "jsonwebtoken";
import { UserResponse } from "../models/user-model";

export const generateAccessToken = (payload: UserResponse): string => {
    const { uuid, username, email, provider } = payload;
    return jwt.sign(
        { uuid, username, email, provider },
        process.env.ACCESS_TOKEN_SECRET_KEY as string,
        { expiresIn: "15m" }
    );
};

export const generateRefreshToken = (payload: UserResponse): string => {
    const { uuid, username, email, provider } = payload;
    return jwt.sign(
        { uuid, username, email, provider },
        process.env.REFRESH_TOKEN_SECRET_KEY as string,
        { expiresIn: "1d" }
    );
};

export const verifyAccessToken = (token: string): JwtPayload | string => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY as string);
};

export const verifyRefreshToken = (token: string): JwtPayload | string => {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY as string);
};
