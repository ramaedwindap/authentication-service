import express from "express";
import { authRouters } from "./auth-routes";

const router = express.Router();

router.use("/auth", authRouters);

export const routes = router;
