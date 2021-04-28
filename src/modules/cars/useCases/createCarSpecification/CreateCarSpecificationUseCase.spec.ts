import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { SpecificationsRepositoryInMemory } from "@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;

describe("Create CarSpecification", () => {
    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();
        createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
            carsRepositoryInMemory,
            specificationsRepositoryInMemory
        );
    });

    it("Should not be able to add a new Specification to non-existing Car", async () => {
        expect(async () => {
            // Carro não será criado pois não contém os atributos necessários
            const car_id = "123";
            const specifications_id = ["54321"];

            // Vai retornar erro pois o carro não existe
            await createCarSpecificationUseCase.execute({
                car_id,
                specifications_id,
            });
        }).rejects.toBeInstanceOf(AppError);
    });

    it("Should be able to add a new Specification to the Car", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Car 2",
            description: "Car description",
            license_plate: "EXMP", // Primeiro nos criamos o Carro para depois executar o teste principal
            fine_amount: 100,
            daily_rate: 120.0,
            brand: "BRAND_TEST",
            category_id: "Category id example 1",
        });

        const specification = await specificationsRepositoryInMemory.create({
            name: "Specificiation1",
            description: "description1",
        });

        const specifications_id = [specification.id];
        console.log(specification.id);

        console.log(specification);

        const specifications_cars = await createCarSpecificationUseCase.execute(
            {
                car_id: car.id,
                specifications_id,
            }
        );

        expect(specifications_cars).toHaveProperty("specifications");
        expect(specifications_cars.specifications.length).toBe(1);
    });
});
