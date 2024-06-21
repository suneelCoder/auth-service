// src/routes/auth.ts
import { Router } from "express";
import AuthController from "../controller/AuthController";
import { AuthService } from "../service/AuthService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import { asyncHandler } from "../utils/asyncHandler";

export const authRouter = Router();
const userRepo = AppDataSource.getRepository(User);
const userService = new AuthService(userRepo);
const authController = new AuthController(userService);

authRouter.route("/register").post(
    asyncHandler(async (req, res) => {
        await authController.register(req, res);
    }),
);
