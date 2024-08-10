import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth-services";
import { RegisterRequest } from "../models/user-model";

export class AuthController {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const request: RegisterRequest = req.body as RegisterRequest;
            const serviceResponse = await AuthService.register(request);
            res.status(serviceResponse.code).json(serviceResponse);
        } catch (e: any) {
            next(e);
        }
    }
}
