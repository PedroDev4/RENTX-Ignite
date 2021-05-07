import request from "supertest";
import { Connection } from "typeorm";

import createConnection from "@shared/infra/database";
import { app } from "@shared/infra/http/app";

let connection: Connection;
describe("Create user Controller", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("Should be able to create a new user", async () => {
        const response = await request(app).post("/users").send({
            name: "UserName Supertest",
            email: "User Email Test",
            driver_license: "XXyy",
            password: "password test",
        });

        console.log(response.body);

        expect(response.status).toBe(201);
    });
});
