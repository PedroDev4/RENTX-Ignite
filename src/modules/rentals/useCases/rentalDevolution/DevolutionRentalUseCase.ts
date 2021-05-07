import { inject, injectable } from "tsyringe";

import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { Rental } from "@modules/rentals/infra/typeorm/model/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
    rental_id: string;
    user_id: string;
}

@injectable()
class DevolutionRentalUseCase {
    constructor(
        @inject("RentalsRepository")
        private rentalsRepository: IRentalsRepository,
        @inject("CarsRepository")
        private carsRepository: ICarsRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider
    ) {
        //
    }

    async execute({ rental_id, user_id }: IRequest): Promise<Rental> {
        const rental = await this.rentalsRepository.findById(rental_id);
        const minimum_daily = 1;

        if (!rental) {
            throw new AppError("Rental Does not Exists!");
        }

        // Recuperando infomations from car
        const car = await this.carsRepository.findById(rental.car_id);

        // Verificar o tempo de aluguel

        const dateNow = this.dateProvider.dateNow();

        // Quantas diarias o alguel possui
        let daily = this.dateProvider.compareInDays(
            rental.start_date,
            this.dateProvider.dateNow()
        );

        if (daily <= 0) {
            // Mesmo se a diaria nao durar no minimo 24 hrs, iremos cobrar como o valor integral da diária
            daily = minimum_daily;
        }

        // Quantidade de dias em atraso
        const delay = this.dateProvider.compareInDays(
            dateNow,
            rental.expected_return_date
        );

        let total = 0;
        if (delay > 0) {
            const calculate_fine = delay * car.fine_amount;
            total = calculate_fine;
        }

        // Total já com a multa somada
        total += daily * car.daily_rate;

        // Atualizando atributos do Rental
        rental.end_date = this.dateProvider.dateNow();
        rental.total = total;

        await this.rentalsRepository.create(rental); // Ao Recriar um objeto ja existente no DB, ele altomaticamente atuliza esse objeto no DB

        // Atualizando a disponibilidade do carro
        await this.carsRepository.updateAvailable(rental.car_id, true);

        return rental;
    }
}

export { DevolutionRentalUseCase };
