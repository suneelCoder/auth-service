// src/routes/auth.ts
import { Request, Router } from "express";
import AuthController from "../controller/AuthController";
import { AuthService } from "../service/AuthService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";
import { body } from "express-validator";
export const authRouter = Router();
const userRepo = AppDataSource.getRepository(User);
const userService = new AuthService(userRepo);
const authController = new AuthController(userService, logger);

authRouter.post(
    "/register",
    body("email").notEmpty(),
    (req: Request, res, next) => authController.register(req, res, next),
);
