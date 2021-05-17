import { CategoriesRepositoryInMemory } from "@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateCategoryuseCase } from "./CreateCategoryuseCase";

let createCategoryUseCase: CreateCategoryuseCase;
let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;

// Applying Testes Unitários
describe("Create Category", () => {
    beforeEach(() => {
        categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
        createCategoryUseCase = new CreateCategoryuseCase(
            categoriesRepositoryInMemory
        );
    });

    it("Should be able to create a new Category", async () => {
        const category = {
            name: "Category Test",
            description: "Category Test Description",
        };
        await createCategoryUseCase.execute({
            name: category.name,
            description: category.description,
        });

        const categoryCreated = await categoriesRepositoryInMemory.findByName(
            category.name
        );

        expect(categoryCreated).toHaveProperty("id");
    });

    it("Should NOT be able to create a new Category with same name", async () => {
        const category = {
            name: "Category Test",
            description: "Category Test Description 2",
        };
        await createCategoryUseCase.execute({
            name: category.name,
            description: category.description,
        });

        await expect(async () => {
            await createCategoryUseCase.execute({
                name: category.name,
                description: category.description,
            });
        }).rejects.toEqual(new AppError("Category Already Exists!"));
    });
});
