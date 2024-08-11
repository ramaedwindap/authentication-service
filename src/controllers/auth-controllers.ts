import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth-service";
import {
    LoginRequest,
    RegisterRequest,
    UserResponse,
} from "../models/user-model";

export class AuthController {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const request: RegisterRequest = req.body as RegisterRequest;
            const serviceResponse = await AuthService.register(request);
            res.status(serviceResponse.code).json(serviceResponse);
        } catch (e) {
            next(e);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const request: LoginRequest = req.body as LoginRequest;
            const serviceResponse = await AuthService.login(request);
            res.status(serviceResponse.code).json(serviceResponse);
        } catch (e) {
            next(e);
        }
    }

    static async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const request: UserResponse = req.user as UserResponse;
            const serviceResponse = await AuthService.getProfile(request);
            res.status(serviceResponse.code).json(serviceResponse);
        } catch (e) {
            next(e);
        }
    }

    static async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const request: UserResponse = req.user as UserResponse;
            const serviceResponse = await AuthService.refreshToken(request);
            res.status(serviceResponse.code).json(serviceResponse);
        } catch (e) {
            next(e);
        }
    }
}
