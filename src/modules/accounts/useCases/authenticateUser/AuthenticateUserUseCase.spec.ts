import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateUserUseCase } from "../CreateUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUserCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
        authenticateUserUseCase = new AuthenticateUserUseCase(
            usersRepositoryInMemory
        );
    });

    it("Should be Able to authenticate an user", async () => {
        const user: ICreateUserDTO = {
            name: "User Test",
            driver_license: "0123",
            password: "1234",
            email: "user@test.com",
        };

        await createUserUseCase.execute(user);

        const result = await authenticateUserUseCase.execute({
            // Authenticating User
            email: user.email,
            password: user.password,
        });

        expect(result).toHaveProperty("token"); // Se o usuario criado tem o atributo ID, quer dizer que foi criado!
    });

    it("Should not bet able to authenticate a nonexisting user", () => {
        expect(async () => {
            await authenticateUserUseCase.execute({
                // Authenticating User
                email: "false@email.com",
                password: "1234",
            });
        }).rejects.toBeInstanceOf(AppError); // Esperamos que a execução do useCase Tenha  uma Rejeição de um erro do tipo AppError
    });

    it("Should not be able to authenticate with incorrect password", () => {
        expect(async () => {
            const user: ICreateUserDTO = {
                driver_license: "233",
                email: "user@user.com",
                password: "2233",
                name: "User test error",
            };

            await createUserUseCase.execute(user);

            await authenticateUserUseCase.execute({
                email: user.email,
                password: "IncorrectPassword",
            });
        }).rejects.toBeInstanceOf(AppError);
    });
});
