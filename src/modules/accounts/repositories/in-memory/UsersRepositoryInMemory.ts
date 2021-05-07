import { User } from "@modules/accounts/infra/typeorm/model/User";

import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { IUsersRepository } from "../IUsersRepository";

class UsersRepositoryInMemory implements IUsersRepository {
    users: User[] = [];

    async create({
        driver_license,
        name,
        password,
        email,
    }: ICreateUserDTO): Promise<User> {
        const user = new User();

        Object.assign(user, {
            driver_license,
            name,
            password,
            email,
        });

        this.users.push(user);
        return user;
    }

    async findByEmail(email: string): Promise<User> {
        return this.users.find((u) => u.email === email);
    }

    async findById(id: string): Promise<User> {
        return this.users.find((u) => u.id === id);
    }
}

export { UsersRepositoryInMemory };
