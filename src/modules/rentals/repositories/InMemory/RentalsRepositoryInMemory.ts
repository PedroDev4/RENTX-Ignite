import { ICreateRentalDTO } from "@modules/rentals/dtos/ICreateRentalDTO";
import { Rental } from "@modules/rentals/infra/typeorm/model/Rental";

import { IRentalsRepository } from "../IRentalsRepository";

class RentalsRepositoryInMemory implements IRentalsRepository {
    rentals: Rental[] = [];

    async create({
        user_id,
        car_id,
        expected_return_date,
    }: ICreateRentalDTO): Promise<Rental> {
        const rental = new Rental();

        Object.assign(rental, {
            expected_return_date,
            user_id,
            car_id,
            start_date: new Date(),
        });

        this.rentals.push(rental);
        return rental;
    }

    async findOpenRentalByCar(car_id: string): Promise<Rental> {
        return this.rentals.find(
            (rental) => rental.car_id === car_id && !rental.end_date // End date é gerado quando o cliente devolve o carro -> rental.endDate === null means: ainda não devolvido(em aberto aluguel)
        );
    }

    async findOpenRentalByUser(user_id: string): Promise<Rental> {
        return this.rentals.find(
            (rental) => rental.user_id === user_id && !rental.end_date
        );
    }
}

export { RentalsRepositoryInMemory };
