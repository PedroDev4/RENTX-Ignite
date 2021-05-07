import { getRepository, Repository } from "typeorm";

import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";

import { Car } from "../model/Car";

class CarsRepository implements ICarsRepository {
    private repository: Repository<Car>;

    constructor() {
        this.repository = getRepository(Car);
    }

    async create({
        brand,
        category_id,
        daily_rate,
        description,
        fine_amount,
        license_plate,
        name,
        specifications,
        id,
    }: ICreateCarDTO): Promise<Car> {
        const car = this.repository.create({
            name,
            brand,
            category_id,
            daily_rate,
            description,
            fine_amount,
            license_plate,
            specifications,
        });

        await this.repository.save(car);

        return car;
    }
    async findByLicensePlate(license_plate: string): Promise<Car> {
        const car = await this.repository.findOne({ license_plate });
        return car;
    }

    async findAvailable(
        brand?: string,
        name?: string,
        category_id?: string
    ): Promise<Car[]> {
        const carsQuery = await this.repository
            .createQueryBuilder("c") // Nome do query Builder
            // eslint-disable-next-line prettier/prettier
            .where("available = :available", { available: true }) // condição base da query ("where car.available === true)

        if (brand) {
            // eslint-disable-next-line prettier/prettier
            carsQuery.andWhere("brand = :brand", { brand }) // (where brand === true && car.brand === brand)
        }

        if (name) {
            // eslint-disable-next-line prettier/prettier
            carsQuery.andWhere("name = :name", { name }) // (where available === true && car.name === name)
        }

        if (category_id) {
            // eslint-disable-next-line prettier/prettier
            carsQuery.andWhere("category_id = :category_id", { category_id }) // (where available === true && car.category_id === category_id)
        }

        const cars = await carsQuery.getMany(); // Retorna array

        return cars;
    }

    async findById(id: string): Promise<Car> {
        const car = await this.repository.findOne(id);
        return car;
    }

    async updateAvailable(id: string, available: boolean): Promise<void> {
        await this.repository
            .createQueryBuilder()
            .update()
            .set({ available })
            .where("id = :id")
            .setParameters({ id })
            .execute();

        // UPDATE CARS SET "AVAILABLE" = 'FALSE' WHERE CAR_ID = "ID";
    }
}

export { CarsRepository };
