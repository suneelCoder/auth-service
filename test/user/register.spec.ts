import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constant";
describe("POST /auth/register", () => {
    let connection: DataSource;
    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });
    beforeEach(async () => {
        // Database truncate
        await connection.dropDatabase();
        await connection.synchronize();
        // await truncateTables(connection);
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
                lastName: "Kumar",
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
                lastName: "Kumar",
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
            lastName: "Kumar",
            email: "rsuneel47@gmail.com",
            password: "password",
        };
        // Act
        await request(app).post("/auth/register").send(userData);
        // Assert

        const userRepo = connection.getRepository(User);
        const users = await userRepo.find();
        expect(users).toHaveLength(1);
        expect(users[0].firstName).toBe(userData.firstName);
        expect(users[0].lastName).toBe(userData.lastName);
        expect(users[0].email).toBe(userData.email);
    });

    it("should assign a customer role", async () => {
        const userData = {
            firstName: "Suneel",
            lastName: "Kumar",
            email: "rsuneel47@gmail.com",
            password: "password",
        };
        // Act
        await request(app).post("/auth/register").send(userData);
        // Assert

        const userRepo = connection.getRepository(User);
        const users = await userRepo.find();
        expect(users[0]).toHaveProperty("role");
        expect(users[0].role).toBe(Roles.CUSTOMER);
    });
    it("should store the hashed password in the database", async () => {
        const userData = {
            firstName: "Suneel",
            lastName: "Kumar",
            email: "rsuneel47@gmail.com",
            password: "password",
        };
        // Act
        await request(app).post("/auth/register").send(userData);

        // Assert
        const userRepo = connection.getRepository(User);
        const users = await userRepo.find();
        expect(users[0].password).not.toBe(userData.password);
        expect(users[0].password).toHaveLength(60);
        expect(users[0].password).toMatch(/^\$2[ayb]\$.{56}$/);
    });
    it("should return 400 if email is already exist", async () => {
        const userData = {
            firstName: "Suneel",
            lastName: "Kumar",
            email: "rsuneel47@gmail.com",
            password: "password",
            role: Roles.CUSTOMER,
        };
        const userRepo = connection.getRepository(User);
        await userRepo.save(userData);
        // Act
        const response = await request(app)
            .post("/auth/register")
            .send(userData);
        const users = await userRepo.find();

        expect(response.statusCode).toBe(400);
        expect(users).toHaveLength(1);
    });
    describe("Fields are missing", () => {
        it("should return 400 status code if email field is missing", async () => {
            const userData = {
                firstName: "Suneel",
                lastName: "Kumar",
                password: "password",
                role: Roles.CUSTOMER,
            };
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            expect(response.statusCode).toBe(400);
        });
    });
});
