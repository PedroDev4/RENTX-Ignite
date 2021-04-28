import { inject, injectable } from "tsyringe";

import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { Car } from "@modules/cars/infra/typeorm/model/Car";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
class CreateCarUseCase {
    constructor(
        @inject("CarsRepository")
        private carsRepository: ICarsRepository
    ) {
        //
    }

    async execute({
        name,
        description,
        daily_rate,
        license_plate,
        brand,
        fine_amount,
        category_id,
    }: ICreateCarDTO): Promise<Car> {
        const carAlreadyExists = await this.carsRepository.findByLicensePlate(
            license_plate
        );

        if (carAlreadyExists) {
            throw new AppError("Car Already Exists!");
        }

        const car = await this.carsRepository.create({
            name,
            description,
            daily_rate,
            brand,
            license_plate,
            fine_amount,
            category_id,
        });

        return car;
    }
}

export { CreateCarUseCase };
