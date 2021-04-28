import { NextFunction, Request, Response } from "express";

import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { AppError } from "@shared/errors/AppError";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function ensureAdmin(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const { id } = request.user;

    const usersRepository = new UsersRepository();

    const user = await usersRepository.findById(id);

    if (!user.isAdmin) {
        // Validando se user é admin, se for vida que segue, se não for nega acesso e para ai!
        throw new AppError("User isn't an admin");
    }

    return next();
}
