import { NextFunction, Response } from "express";
import { RegisterUserRequest } from "../types";
import { AuthService } from "../service/AuthService";
import { Logger } from "winston";
import { validationResult } from "express-validator";
import { JwtPayload, sign } from "jsonwebtoken";
import fs from "fs";
import path from "path";
import createHttpError from "http-errors";
import { Config } from "../config";
class AuthController {
    constructor(
        private userService: AuthService,
        private logger: Logger,
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
            let privateKey: Buffer;
            try {
                privateKey = fs.readFileSync(
                    path.join(__dirname, "../../certs/private.pem"),
                );
            } catch (error) {
                const err = createHttpError(
                    500,
                    "Some error while getting private key",
                );
                return next(err);
            }
            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };
            const accessToken = sign(payload, privateKey, {
                expiresIn: "1h",
                issuer: "auth-service",
                algorithm: "RS256",
            });

            const refreshToken = sign(payload, Config.JWT_SECRET!, {
                algorithm: "HS256",
                expiresIn: "1y",
                issuer: "auth-service",
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
            res.status(201).json({ message: "Suneel" });
        } catch (error) {
            return next(error);
        }
    }
}

export default AuthController;
