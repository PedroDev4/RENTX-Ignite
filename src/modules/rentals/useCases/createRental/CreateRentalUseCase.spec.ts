import dayjs from "dayjs";

import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { CreateCarUseCase } from "@modules/cars/useCases/createCar/CreateCarUseCase";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/InMemory/RentalsRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let createRentalUseCase: CreateRentalUseCase;
let dayJsDateProvider: DayjsDateProvider;
let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Create Rentals", () => {
    const DayAdd24hours = dayjs().add(1, "day").toDate();
    beforeEach(() => {
        rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
        dayJsDateProvider = new DayjsDateProvider();
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
        createRentalUseCase = new CreateRentalUseCase(
            rentalsRepositoryInMemory,
            dayJsDateProvider,
            carsRepositoryInMemory
        );
    });

    it("Should be able to create a new rental", async () => {
        const car = await createCarUseCase.execute({
            name: "CarName Supertest",
            description: "CarDescriptionTest",
            daily_rate: 100,
            license_plate: "XXX-yui",
            brand: "Brand Test",
            fine_amount: 50,
            category_id: "Category id Test",
        });

        const rental = await createRentalUseCase.execute({
            user_id: "12345",
            car_id: car.id,
            expected_return_date: DayAdd24hours,
        });

        expect(rental).toHaveProperty("id");
        expect(rental).toHaveProperty("car_id");
        expect(rental).toHaveProperty("user_id");
        expect(rental).toHaveProperty("expected_return_date");
    });

    it("Should NOT be able to create a new rental if this there's another open to the same User", async () => {
        await rentalsRepositoryInMemory.create({
            car_id: "1234",
            expected_return_date: DayAdd24hours,
            user_id: "12345",
        });

        expect(async () => {
            await createRentalUseCase.execute({
                user_id: "12345",
                car_id: "123",
                expected_return_date: new Date(),
            });
        }).rejects.toEqual(
            new AppError("There's a rental in progress for user!")
        );
    });

    it("Should NOT be able to create a new rental if this there's another open to the same Car", async () => {
        await rentalsRepositoryInMemory.create({
            car_id: "1234",
            expected_return_date: DayAdd24hours,
            user_id: "12345",
        });

        expect(async () => {
            await createRentalUseCase.execute({
                user_id: "12345",
                car_id: "123",
                expected_return_date: DayAdd24hours,
            });
        }).rejects.toEqual(new AppError("Car is unavailable"));
    });

    it("Should NOT be able to create a new rental with invalid return time", async () => {
        expect(async () => {
            await createRentalUseCase.execute({
                user_id: "123",
                car_id: "ABC",
                expected_return_date: dayjs().toDate(),
            });
        }).rejects.toEqual(
            new AppError(
                "Invalid Return time. Minimun rental time is 24 hours!"
            )
        );
    });
});
