import { Response } from "express";
import { RegisterUserRequest } from "../types";
import { AuthService } from "../service/AuthService";

class AuthController {
    constructor(private userService: AuthService) {
        this.userService = userService;
    }
    async register(req: RegisterUserRequest, res: Response) {
        const { firstName, lastName, email, password } = req.body;
        await this.userService.create({ firstName, lastName, email, password });
        res.status(201).json({ message: "Suneel" });
    }
}

export default AuthController;
