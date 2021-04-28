import { Specification } from "@modules/cars/infra/typeorm/model/Specification";
import {
    ICreateSpecificationDTO,
    ISpecificationsRepository,
} from "@modules/cars/repositories/ISpecificationsRepository";

class SpecificationsRepositoryInMemory implements ISpecificationsRepository {
    specifications: Specification[] = [];

    async create({
        name,
        description,
    }: ICreateSpecificationDTO): Promise<Specification> {
        const specification = new Specification();
        Object.assign(specification, {
            name,
            description,
        });

        this.specifications.push(specification);

        return specification;
    }
    async findByName(name: string): Promise<Specification> {
        return this.specifications.find(
            (specification) => specification.name === name
        );
    }
    async findByIds(ids: string[]): Promise<Specification[]> {
        const allSpecifications = this.specifications.filter(
            (specification) => ids.includes(specification.id) // Filtrando no array de specifications os objetos que incluem o specificification.id do objeto; returning the objects that includes the received specification_id
        );

        return allSpecifications;
    }
}

export { SpecificationsRepositoryInMemory };
