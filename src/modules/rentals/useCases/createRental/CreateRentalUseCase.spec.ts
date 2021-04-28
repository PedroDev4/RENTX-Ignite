import dayjs from "dayjs";

import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/InMemory/RentalsRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let createRentalUseCase: CreateRentalUseCase;
let dayJsDateProvider: DayjsDateProvider;

describe("Create Rentals", () => {
    const DayAdd24hours = dayjs().add(1, "day").toDate();
    beforeEach(() => {
        rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
        dayJsDateProvider = new DayjsDateProvider();
        createRentalUseCase = new CreateRentalUseCase(
            rentalsRepositoryInMemory,
            dayJsDateProvider
        );
    });

    it("Should be able to create a new rental", async () => {
        const rental = await createRentalUseCase.execute({
            user_id: "12345",
            car_id: "123",
            expected_return_date: DayAdd24hours,
        });

        expect(rental).toHaveProperty("id");
        expect(rental).toHaveProperty("car_id");
        expect(rental).toHaveProperty("user_id");
        expect(rental).toHaveProperty("expected_return_date");
    });

    it("Should NOT be able to create a new rental if this there's another open to the same User", async () => {
        expect(async () => {
            await createRentalUseCase.execute({
                user_id: "12345",
                car_id: "123",
                expected_return_date: DayAdd24hours,
            });

            await createRentalUseCase.execute({
                user_id: "12345",
                car_id: "123",
                expected_return_date: new Date(),
            });
        }).rejects.toBeInstanceOf(AppError);
    });

    it("Should NOT be able to create a new rental if this there's another open to the same Car", async () => {
        expect(async () => {
            await createRentalUseCase.execute({
                user_id: "123",
                car_id: "ABC",
                expected_return_date: DayAdd24hours,
            });

            await createRentalUseCase.execute({
                user_id: "321",
                car_id: "ABC",
                expected_return_date: DayAdd24hours,
            });
        }).rejects.toBeInstanceOf(AppError);
    });

    it("Should NOT be able to create a new rental with invalid return time", async () => {
        expect(async () => {
            await createRentalUseCase.execute({
                user_id: "123",
                car_id: "ABC",
                expected_return_date: dayjs().toDate(),
            });
        }).rejects.toBeInstanceOf(AppError);
    });
});
