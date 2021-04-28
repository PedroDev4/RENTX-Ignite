import { getRepository, Repository } from "typeorm";

import {
    ICategoriesRepository,
    ICreateCategoryDTO,
} from "@modules/cars/repositories/ICategoriesRepository";

import { Category } from "../model/Category";

// This class is a implementation of our interface => SRP SOLID
class CategoriesRepository implements ICategoriesRepository {
    private repository: Repository<Category>;

    constructor() {
        this.repository = getRepository(Category);
    }

    // Quando o retorno é void(não return nada) mas nos temos async e await o retorno é Promise<void>;
    async create({ description, name }: ICreateCategoryDTO): Promise<void> {
        const category = this.repository.create({
            description,
            name,
        });

        await this.repository.save(category);
    }

    async list(): Promise<Category[]> {
        const categories = await this.repository.find();
        return categories;
    }

    async findByName(name: string): Promise<Category> {
        // WE WANT A:  SELECT * FROM CATEGORIES WHERE NAME = "name"; limit 1
        const category = await this.repository.findOne({ name }); // As chaves é o nosso "WHERE"

        return category;
    }
}

export { CategoriesRepository };
