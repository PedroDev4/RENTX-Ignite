import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";

import { ListCarsUseCase } from "./ListCarsUseCase";

let listCarsUseCase: ListCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("List Cars", () => {
    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        listCarsUseCase = new ListCarsUseCase(carsRepositoryInMemory);
    });

    it("should be able to list all available cars", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Car 1",
            description: "Car description",
            license_plate: "EXMP",
            fine_amount: 100,
            daily_rate: 120.0,
            brand: "BRAND",
            category_id: "Category id example 1",
        });

        const cars = await listCarsUseCase.execute({});
        expect(cars).toEqual([car]); // Espero que o retorno da listagem seja um array com o objeto criado;
    });

    it("should be able to list all available cars by brand", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Car 2",
            description: "Car description",
            license_plate: "EXMP",
            fine_amount: 100,
            daily_rate: 120.0,
            brand: "BRAND_TEST",
            category_id: "Category id example 1",
        });

        const cars = await listCarsUseCase.execute({
            brand: "BRAND_TEST",
        });

        expect(cars).toEqual([car]);
    });

    it("should be able to list all available cars by name", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Car3",
            description: "Car description",
            license_plate: "EXMP",
            fine_amount: 100,
            daily_rate: 120.0,
            brand: "BRAND_TEST4",
            category_id: "Category id example 4",
        });

        const cars = await listCarsUseCase.execute({
            name: "Car3",
        });

        expect(cars).toEqual([car]);
    });

    it("should be able to list all available cars by name", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Car5",
            description: "Car description",
            license_plate: "EXMP",
            fine_amount: 100,
            daily_rate: 120.0,
            brand: "BRAND_TEST5",
            category_id: "Category id example 5",
        });

        const cars = await listCarsUseCase.execute({
            category_id: "Category id example 5",
        });

        expect(cars).toEqual([car]);
    });
});
