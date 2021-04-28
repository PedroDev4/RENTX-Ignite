import { Category } from "@modules/cars/infra/typeorm/model/Category";

// DTO => Data Transfer Object -> SRP Não tem a responsabilidade de acessar a 'request' da rota;
interface ICreateCategoryDTO {
    name: string;
    description: string;
}

// LSP - Liskov Substution Principle -> Criando nosso 'contrato' (Interface);
// A Classe de Repository que 'assinar nosso contrato' vai ter acesso aos metodos de repositorio;
interface ICategoriesRepository {
    findByName(name: string): Promise<Category>;
    list(): Promise<Category[]>;
    create({ name, description }: ICreateCategoryDTO): Promise<void>;
}

export { ICategoriesRepository, ICreateCategoryDTO };
