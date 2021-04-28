import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { Car } from "@modules/cars/infra/typeorm/model/Car";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";

class CarsRepositoryInMemory implements ICarsRepository {
    cars: Car[] = [];

    async create({
        brand,
        category_id,
        daily_rate,
        name,
        description,
        license_plate,
        specifications,
        id,
    }: ICreateCarDTO): Promise<Car> {
        const car = new Car();

        Object.assign(car, {
            brand,
            category_id,
            daily_rate,
            name,
            description,
            license_plate,
            specifications,
            id,
        });

        this.cars.push(car);

        return car;
    }

    async findByLicensePlate(license_plate: string): Promise<Car> {
        return this.cars.find((car) => car.license_plate === license_plate);
    }

    async findAvailable(
        category_id?: string,
        brand?: string,
        name?: string
    ): Promise<Car[]> {
        // Find retorna somente 1 Object // Filter retorna +1 Objeto;
        const cars = this.cars.filter((car) => {
            if (
                car.available === true ||
                (brand && car.brand === brand) ||
                (category_id && category_id === car.category_id) ||
                (name && name === car.name)
            ) {
                return car;
            }
            return null;
        });

        return cars;
    }

    async findById(id: string): Promise<Car> {
        const car = this.cars.find((car) => car.id === id);
        return car;
    }
}

export { CarsRepositoryInMemory };
