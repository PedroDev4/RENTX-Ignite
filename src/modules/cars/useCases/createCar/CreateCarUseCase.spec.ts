import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateCarUseCase } from "./CreateCarUseCase";

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Create Car", () => {
    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
    });

    it("Should be able to create a new Car", async () => {
        const car = await createCarUseCase.execute({
            name: "Car Name",
            description: "Description Car",
            daily_rate: 100,
            license_plate: "idk2",
            brand: "Car Brand",
            fine_amount: 60,
            category_id: "category",
        } as ICreateCarDTO);
        expect(car).toHaveProperty("id");
    });

    it("should not be able to create a car with an existing license_plate", () => {
        expect(async () => {
            await createCarUseCase.execute({
                name: "Car1 Name",
                description: "Description Car",
                daily_rate: 100,
                license_plate: "ABC123",
                brand: "Car Brand",
                fine_amount: 60,
                category_id: "category",
            } as ICreateCarDTO);

            await createCarUseCase.execute({
                name: "Car2 Name",
                description: "Description Car",
                license_plate: "ABC123",
                daily_rate: 100,
                brand: "Car Brand",
                fine_amount: 60,
                category_id: "category",
            } as ICreateCarDTO);
        }).rejects.toBeInstanceOf(AppError);
    });

    it("Should be able to create a car with available true by default", async () => {
        const car = await createCarUseCase.execute({
            name: "Car Available",
            description: "Description Car",
            daily_rate: 100,
            license_plate: "XYZ",
            brand: "Car Brand",
            fine_amount: 60,
            category_id: "category",
        } as ICreateCarDTO);

        expect(car.available).toBe(true);
    });
});
