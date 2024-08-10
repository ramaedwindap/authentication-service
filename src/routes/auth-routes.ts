import { Router } from "express";
import { AuthController } from "../controllers/auth-controllers";
import { registerValidation } from "../utils/validations/auth-validation";

const router = Router();

router.post("/register", registerValidation, AuthController.register);

export const authRouters = router;
