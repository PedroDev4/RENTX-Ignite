import { inject, injectable } from "tsyringe";

import { ICategoriesRepository } from "@modules/cars/repositories/ICategoriesRepository";
import { AppError } from "@shared/errors/AppError";
// O nosso serviço não tem que 'conhecer' os metodos de rotas (Request,Response)
interface IRequest {
    name: string;
    description: string;
}
// Utilizando o principio da Responsabilidade única
@injectable()
class CreateCategoryuseCase {
    // Principio da Inversão de dependencia (Ao invés do Service ter a responsabilidade de chamar repository// quem chamar nosso service que vai ter essa responsabilidade)
    constructor(
        @inject("CategoriesRepository") // Tsyringe Responsavel por fazer a instancia do nosso CategoriresRepository
        private categoriesRepository: ICategoriesRepository
    ) {
        //
    } // Recebendo um repository que seja subtipo da interface ICategoriesRepository;

    async execute({ name, description }: IRequest): Promise<void> {
        const categoryAlreadyExists = await this.categoriesRepository.findByName(
            name
        );

        if (categoryAlreadyExists) {
            throw new AppError("Category Already Exists!");
        }

        await this.categoriesRepository.create({ name, description });
    }
}

export { CreateCategoryuseCase };
