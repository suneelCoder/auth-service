import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constant";
import { isJwt } from "../utils";
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
        it("should return 201 status code", async () => {
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
    it("should return access and refresh token inside cookie", async () => {
        const userData = {
            firstName: "Suneel",
            lastName: "Kumar",
            email: "rsuneel47@gmail.com",
            password: "password",
            role: Roles.CUSTOMER,
        };
        // Act
        const response = await request(app)
            .post("/auth/register")
            .send(userData);

        // Define a custom type for headers that might include 'set-cookie'
        interface CustomHeaders {
            [key: string]: [];
        }

        // Cast to CustomHeaders
        const responseHeaders = response.headers as unknown as CustomHeaders;

        // Extract cookies if they exist
        const cookies = responseHeaders["set-cookie"] || [];

        let accessToken = null;
        let refreshToken = null;

        // Process cookies to extract tokens
        cookies.forEach((element: string) => {
            if (element.startsWith("accessToken=")) {
                accessToken = element.split(";")[0].split("=")[1];
            }
            if (element.startsWith("refreshToken=")) {
                refreshToken = element.split(";")[0].split("=")[1];
            }
        });

        // Assertions to verify the tokens are not null
        expect(accessToken).not.toBeNull();
        expect(refreshToken).not.toBeNull();
        expect(isJwt(accessToken)).toBeTruthy();
        // expect(isJwt(refreshToken)).toBeTruthy()
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
            const userRepo = connection.getRepository(User);
            const users = await userRepo.find();
            expect(users).toHaveLength(0);
        });
        it.todo("should return 400 if firstname is missing");
        it.todo("should return 400 if lastname is missing");
        it.todo("should return 400 if password is missing");
    });

    describe("Fields are not in proper format", () => {
        it("should trim the email field", async () => {
            const userData = {
                firstName: "Suneel",
                lastName: "Kumar",
                password: "password",
                role: Roles.CUSTOMER,
                email: "rsuneel47@gmail.com         ",
            };
            await request(app).post("/auth/register").send(userData);
            const userRepo = connection.getRepository(User);
            const users = await userRepo.find();
            const user = users[0];
            expect(user.email).toBe("rsuneel47@gmail.com");
        });
        it.todo("should return 400 if email is not valid email");
        it.todo("should return 400 if password length is less than 6 char");
    });
});
