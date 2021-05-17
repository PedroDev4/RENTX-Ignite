import { inject, injectable } from "tsyringe";

import { Rental } from "@modules/rentals/infra/typeorm/model/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";

@injectable()
class ListRentalsByUserUseCase {
    constructor(
        @inject("RentalsRepository")
        private rentalsRepository: IRentalsRepository
    ) {
        //
    }

    async execute(user_id: string): Promise<Rental[]> {
        const userRentals = await this.rentalsRepository.findByUser(user_id);

        return userRentals;
    }
}

export { ListRentalsByUserUseCase };
