// src/routes/auth.ts
import { NextFunction, Request, Response, Router } from "express";
import AuthController from "../controller/AuthController";
import { AuthService } from "../service/AuthService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";
import registerValidators from "../validators/register-validators";
import { TokenService } from "../service/TokenService";
import { RefreshToken } from "../entity/RefreshToken";
export const authRouter = Router();
const userRepo = AppDataSource.getRepository(User);
const userService = new AuthService(userRepo);
const refreshTokenRepo = AppDataSource.getRepository(RefreshToken);
const tokenService = new TokenService(refreshTokenRepo);
const authController = new AuthController(userService, logger, tokenService);

authRouter.post(
    "/register",
    registerValidators,
    (req: Request, res: Response, next: NextFunction) =>
        authController.register(req, res, next),
);
