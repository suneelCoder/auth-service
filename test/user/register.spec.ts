import request from "supertest";
import app from "../../src/app";
describe("POST /auth/register", () => {
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
        const response = await request(app)
            .post("/auth/register")
            .send(userData);
        // Assert

        expect(response.headers["content-type"]).toEqual(
            expect.stringContaining("json"),
        );
    });
    describe("Fields are missing", () => {});
});
