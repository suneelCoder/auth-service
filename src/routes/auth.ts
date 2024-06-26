// src/routes/auth.ts
import { NextFunction, Request, Response, Router } from "express";
import AuthController from "../controller/AuthController";
import { AuthService } from "../service/AuthService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";
import registerValidators from "../validators/register-validators";
export const authRouter = Router();
const userRepo = AppDataSource.getRepository(User);
const userService = new AuthService(userRepo);
const authController = new AuthController(userService, logger);

authRouter.post(
    "/register",
    registerValidators,
    (req: Request, res: Response, next: NextFunction) =>
        authController.register(req, res, next),
);
