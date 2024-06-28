import { NextFunction, Response } from "express";
import { RegisterUserRequest } from "../types";
import { AuthService } from "../service/AuthService";
import { Logger } from "winston";
import { validationResult } from "express-validator";
import { JwtPayload } from "jsonwebtoken";
import { TokenService } from "../service/TokenService";
class AuthController {
    constructor(
        private userService: AuthService,
        private logger: Logger,
        private tokenService: TokenService,
    ) {
        this.userService = userService;
    }
    async register(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        // Validation
        const result = validationResult(req);
        if (!result.isEmpty())
            return res.status(400).json({ errors: result.array() });
        try {
            const { firstName, lastName, email, password } = req.body;
            this.logger.debug("New request to register a user", {
                firstName,
                lastName,
                email,
            });
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
            });
            this.logger.info("User has been registered", { id: user.id });
            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };
            const accessToken = this.tokenService.generateAccessToken(payload);
            const newRefToken =
                await this.tokenService.persistRefreshToken(user);

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: newRefToken.id,
            });
            res.cookie("accessToken", accessToken, {
                maxAge: 1000 * 60 * 60,
                sameSite: "strict",
                domain: "localhost",
                httpOnly: true,
            });
            res.cookie("refreshToken", refreshToken, {
                maxAge: 1000 * 60 * 60 * 24 * 365,
                sameSite: "strict",
                domain: "localhost",
                httpOnly: true,
            });
            res.status(201).json({ id: user.id });
        } catch (error) {
            return next(error);
        }
    }
}

export default AuthController;
