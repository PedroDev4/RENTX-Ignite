import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuid } from "uuid";

import createConnection from "@shared/infra/database";
import { app } from "@shared/infra/http/app";

let connection: Connection;
describe("List Categories", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();

        const id = uuid();
        const password = await hash("admin", 8);

        await connection.query(
            `INSERT INTO USERS(id,name,email,password, "isAdmin", created_at, driver_license) values('${id}' , 'admin', 'admin@rentx.com', '${password}', true, 'now()', 'xXxX')`
        );
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("Should be able to list all categories", async () => {
        const responseToken = await request(app).post("/sessions").send({
            email: "admin@rentx.com",
            password: "admin",
        });

        const { token } = responseToken.body;

        await request(app)
            .post("/categories")
            .send({
                name: "Categories Supertest",
                description: "Categories Supertest Description",
            })
            .set({
                Authorization: `Bearer ${token}`,
            });

        const response = await request(app).get("/categories");

        expect(response.status).toBe(200);
        expect(response.body.lenght).toBe(1);
        expect(response.body[0]).toHaveProperty("id");
        expect(response.body[0].name).toEqual("Categories Supertest");
    });
});
