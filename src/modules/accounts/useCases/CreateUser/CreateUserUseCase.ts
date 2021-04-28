import { hash } from "bcryptjs";
import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";

import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";

@injectable()
class CreateUserUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) {
        //
    }

    async execute({
        name,
        password,
        email,
        driver_license,
    }: ICreateUserDTO): Promise<void> {
        const userAlreadyExists = await this.usersRepository.findByEmail(email);

        if (userAlreadyExists) {
            throw new AppError("User Already Exists!");
        }

        const passwordHash = await hash(password, 8); // Criptografando senha

        await this.usersRepository.create({
            name,
            password: passwordHash,
            email,
            driver_license,
        });
    }
}

export { CreateUserUseCase };
