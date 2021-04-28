import { inject, injectable } from "tsyringe";

/* import { CarImage } from "@modules/cars/infra/typeorm/model/CarImage"; */
import { ICarsImagesRepository } from "@modules/cars/repositories/ICarsImagesRepository";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
    car_id: string;
    images_name: string[];
}

@injectable()
class UploadCarImageUseCase {
    constructor(
        @inject("CarsImagesRepository")
        private carImagesRepository: ICarsImagesRepository,
        @inject("CarsRepository")
        private carsRepository: ICarsRepository
    ) {
        //
    }

    async execute({ car_id, images_name }: IRequest): Promise<void> {
        const carExists = await this.carsRepository.findById(car_id);

        if (!carExists) {
            throw new AppError("Car does not Exists!");
        }

        // Percorrendo o array com os paths das images e salvando no DB
        images_name.map(async (image) => {
            await this.carImagesRepository.create(car_id, image);
        });
    }
}

export { UploadCarImageUseCase };
