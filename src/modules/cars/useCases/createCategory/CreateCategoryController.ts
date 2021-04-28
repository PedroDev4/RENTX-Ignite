import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateCategoryuseCase } from "./CreateCategoryuseCase";

class CreateCategoryController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { name, description } = request.body;

        const createCategoryuseCase = container.resolve(CreateCategoryuseCase);

        await createCategoryuseCase.execute({ name, description });

        return response.status(201).send();
    }
}

export { CreateCategoryController };
