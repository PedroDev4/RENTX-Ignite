import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuid } from "uuid";

import createConnection from "@shared/infra/database";
import { app } from "@shared/infra/http/app";

let connection: Connection;
describe("Create Car", () => {
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

    it("Should be able to create a new Car", async () => {
        const responseToken = await request(app).post("/sessions").send({
            email: "admin@rentx.com",
            password: "admin",
        });

        const { token } = responseToken.body;
        console.log(token);

        const responseCategory = await request(app)
            .post("/categories")
            .send({
                name: "Categories Supertest",
                description: "Categories Supertest Description",
            })
            .set({
                Authorization: `Bearer ${token}`,
            });

        const { id } = responseCategory.body;

        const responseCar = await request(app)
            .post("/cars")
            .send({
                name: "CarName Supertest",
                description: "CarDescriptionTest",
                daily_rate: 100,
                license_plate: "XXX-yui",
                brand: "Brand Test",
                fine_amount: 50,
                category_id: id,
            })
            .set({
                Authorization: `Bearer ${token}`,
            });

        expect(responseCar.status).toBe(201);
    });
});
