import app from "./src/app";
import calculate from "./src/utils";
import request from "supertest";
describe.skip("App", () => {
    it("should work", () => {
        const res = calculate(100, 10);
        expect(res).toBe(10);
    });
    it("should return 200 status", async () => {
        const res = await request(app).get("/").send();
        expect(res.statusCode).toBe(200);
    });
});
