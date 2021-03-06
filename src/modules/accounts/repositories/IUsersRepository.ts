import { User } from "@modules/accounts/infra/typeorm/model/User";

import { ICreateUserDTO } from "../dtos/ICreateUserDTO";

interface IUsersRepository {
    create(data: ICreateUserDTO): Promise<User>;
    findByEmail(email: string): Promise<User>;
    findById(id: string): Promise<User>;
}

export { IUsersRepository };
