import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UserData } from "../types";
import createHttpError from "http-errors";
import { Roles } from "../constant";
import bcrypt from "bcrypt";

export class AuthService {
    constructor(private userRepo: Repository<User>) {}
    async create({ firstName, lastName, email, password }: UserData) {
        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(password, saltRounds);
        const user = await this.userRepo.findOne({ where: { email } });
        if (user) {
            const err = createHttpError(
                400,
                "User is already exist with this email.",
            );
            throw err;
        }

        try {
            return await this.userRepo.save({
                firstName,
                lastName,
                email,
                password: hashPassword,
                role: Roles.CUSTOMER,
            });
        } catch (error) {
            const err = createHttpError(
                500,
                "Failed to store the data in the database",
            );
            throw err;
        }
    }
}
