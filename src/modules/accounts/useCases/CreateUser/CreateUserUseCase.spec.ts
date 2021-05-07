import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateUserUseCase } from "./CreateUserUseCase";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;
describe("User Creation", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory(); // Antes de cada teste: fazer instancias
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    });

    it("Should be able to create a new user", async () => {
        const user = await createUserUseCase.execute({
            name: "User Name Test",
            email: "useremail@email.com",
            driver_license: "XXYY",
            password: "userpasswordtest",
        });
        console.log(user);

        expect(user).toHaveProperty("id");
    });

    it("Should not be able to create an existing user", () => {
        expect(async () => {
            await createUserUseCase.execute({
                name: "User Name Test",
                email: "useremail@email.com",
                driver_license: "XXYY",
                password: "userpasswordtest",
            });

            await createUserUseCase.execute({
                name: "User Name Test",
                email: "useremail@email.com",
                driver_license: "XXYY",
                password: "userpasswordtest",
            });
        }).rejects.toBeInstanceOf(AppError);
    });
});
