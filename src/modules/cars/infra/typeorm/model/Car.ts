import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";

import { Category } from "./Category";
import { Specification } from "./Specification";

@Entity("cars")
class Car {
    @PrimaryColumn()
    id?: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    license_plate: string;

    @Column()
    daily_rate: number;

    @Column()
    available: boolean;

    @Column()
    fine_amount: number;

    @Column()
    brand: string;

    @ManyToOne(() => Category)
    @JoinColumn({ name: "category_id" })
    category: Category; // Linkando chave estrangeira (category_id) com o a Chave Primária (ID) da table de categories

    @ManyToMany(() => Specification) // Tabela do Many To many
    @JoinTable({
        name: "specifications_cars", // Nome da tabela de Relacionamento
        joinColumns: [{ name: "car_id" }], // Nome da coluna dentro da tabela de rel. que referencia a tabela que estamos (Car);
        inverseJoinColumns: [{ name: "specification_id" }], // Outra coluna que referencia a tabela que estamos inserindo dentro do ManyToMany
    })
    specifications: Specification[];

    @CreateDateColumn()
    created_at: Date;

    @Column()
    category_id: string;

    constructor() {
        // Para TDD também
        if (!this.id) {
            this.id = uuid();
            this.available = true;
        }
    }
}

export { Car };
