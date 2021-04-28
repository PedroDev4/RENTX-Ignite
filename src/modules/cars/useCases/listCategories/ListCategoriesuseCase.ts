import { inject, injectable } from "tsyringe";

import { Category } from "@modules/cars/infra/typeorm/model/Category";
import { ICategoriesRepository } from "@modules/cars/repositories/ICategoriesRepository";

@injectable()
class ListCategoriesuseCase {
    // Principio da Inversão de dependencia (Ao invés do Service ter a responsabilidade de chamar repository// quem chamar nosso service que vai ter essa responsabilidade)
    constructor(
        @inject("CategoriesRepository")
        private categoriesRepository: ICategoriesRepository
    ) {
        //
    } // Recebendo um repository que seja subtipo da interface ICategoriesRepository;

    async execute(): Promise<Category[]> {
        const categories = await this.categoriesRepository.list();

        return categories;
    }
}

export { ListCategoriesuseCase };
