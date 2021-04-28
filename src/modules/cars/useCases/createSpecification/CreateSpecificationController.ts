import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateSpecificationuseCase } from "./CreateSpecificationuseCase";

class CreateSpecificationController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { name, description } = request.body;

        const createSpecificationuseCase = container.resolve(
            CreateSpecificationuseCase
        );

        await createSpecificationuseCase.execute({ name, description });


        return response.status(201).send();
    }
}

export { CreateSpecificationController };
