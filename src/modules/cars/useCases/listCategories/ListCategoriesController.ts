import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListCategoriesuseCase } from "./ListCategoriesuseCase";

class ListCategoriesController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listCategoryuseCase = container.resolve(ListCategoriesuseCase);
        const all = await listCategoryuseCase.execute();
        return response.json(all);
    }
}

export { ListCategoriesController };
