import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { inject, injectable } from "tsyringe";

import { Rental } from "@modules/rentals/infra/typeorm/model/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

dayjs.extend(utc);

interface IRequest {
    user_id: string;
    car_id: string;
    expected_return_date: Date;
}

@injectable()
class CreateRentalUseCase {
    constructor(
        @inject("RentalsRepository")
        private rentalsRepository: IRentalsRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider
    ) {
        //
    }

    async execute({
        user_id,
        car_id,
        expected_return_date,
    }: IRequest): Promise<Rental> {
        // [X] Não deve ser possivel cadastrar um novo aluguel caso já exista um aluguel aberto para o mesmo carro
        const rentalOpenToCar = await this.rentalsRepository.findOpenRentalByCar(
            car_id
        );

        if (rentalOpenToCar) {
            // Se existe um "rentalOpenToCar"
            throw new AppError("Car is unavailable");
        }

        // [X] Não deve ser possivel cadastrar um novo aluguel caso já exista um aluguel aberto para o mesmo usuário
        const rentalOpenToUser = await this.rentalsRepository.findOpenRentalByUser(
            user_id
        );

        if (rentalOpenToUser) {
            // Se existe um "rentalOpenToUser"
            throw new AppError("There's a rental in progress for user!");
        }

        // [X] O aluguel deve ter duração minima de 24 horas
        const minimumHour = 24;
        const dateNow = this.dateProvider.dateNow();

        const compare = this.dateProvider.compareInHours(
            dateNow,
            expected_return_date
        );

        if (compare < minimumHour) {
            throw new AppError(
                "Invalid Return time. Minimun rental time is 24 hours!"
            );
        }

        const rental = await this.rentalsRepository.create({
            user_id,
            car_id,
            expected_return_date,
        });

        return rental;
    }
}
export { CreateRentalUseCase };
