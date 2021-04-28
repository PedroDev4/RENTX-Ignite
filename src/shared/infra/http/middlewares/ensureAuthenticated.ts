import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { AppError } from "@shared/errors/AppError";

interface IPayload {
    sub: string; // Take what comes from payload ( sub = user_id )
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction
) {
    // We'll verify if user is Authenticated
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new AppError("Token Missing", 401);
    }

    // token = Bearer 6545646546486

    const [, token] = authHeader.split(" ");

    try {
        const { sub: user_id } = verify(
            token,
            "f81243572aa4c126aaba36b59496d48f"
        ) as IPayload; // This method it Returns user_id

        const usersRepository = new UsersRepository();

        const user = usersRepository.findById(user_id);

        if (!user) {
            throw new AppError("User does not exists!", 401);
        }

        // Passando o usuário no "request"
        request.user = {
            // Reescrever tipagem do request do Express;
            id: user_id,
        };

        next();
    } catch {
        throw new AppError("Invalid Token!", 401);
    }
}
