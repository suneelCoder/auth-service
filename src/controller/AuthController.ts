import { NextFunction, Response } from "express";
import { RegisterUserRequest } from "../types";
import { AuthService } from "../service/AuthService";
import { Logger } from "winston";
import { validationResult } from "express-validator";

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
            res.status(201).json({ message: "Suneel" });
        } catch (error) {
            return next(error);
        }
    }
}

export default AuthController;
