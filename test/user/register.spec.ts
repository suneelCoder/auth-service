import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { truncateTables } from "../utils";
import { User } from "../../src/entity/User";
describe("POST /auth/register", () => {
    let connection: DataSource;
    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });
    beforeEach(async () => {
        // Database truncate
        await truncateTables(connection);
    });
    afterAll(async () => {
        await connection.destroy();
    });
    describe("Given all fields", () => {
        it("should return 201 status could", async () => {
            // AAA
            // Arrange
            const userData = {
                firstName: "Suneel",
                lastname: "Kumar",
                email: "rsuneel47@gmail.com",
                password: "password",
            };
            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            // Assert

            expect(response.statusCode).toBe(201);
        });
        it("should return valid json ", async () => {
            const userData = {
                firstName: "Suneel",
                lastname: "Kumar",
                email: "rsuneel47@gmail.com",
                password: "password",
            };
            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            // Assert

            expect(response.headers["content-type"]).toEqual(
                expect.stringContaining("json"),
            );
        });
    });
    it("should persist the user in database", async () => {
        const userData = {
            firstName: "Suneel",
            lastname: "Kumar",
            email: "rsuneel47@gmail.com",
            password: "password",
        };
        // Act
        await request(app).post("/auth/register").send(userData);
        // Assert

        const userRepo = connection.getRepository(User);
        const users = await userRepo.find();
        expect(users).toHaveLength(1);
    });
    describe("Fields are missing", () => {});
});
