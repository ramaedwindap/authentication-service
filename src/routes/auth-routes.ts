import { Router } from "express";
import { AuthController } from "../controllers/auth-controllers";
import {
    loginValidation,
    registerValidation,
} from "../utils/validations/auth-validation";
import {
    authentication,
    refreshToken,
} from "../middlewares/authentication-middleware";

const router = Router();

router.post("/register", registerValidation, AuthController.register);
router.post("/login", loginValidation, AuthController.login);
router.get("/get-profile", authentication, AuthController.getProfile);
router.post("/refresh-token", refreshToken, AuthController.refreshToken);

export const authRoutes = router;
