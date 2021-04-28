import { Entity, Column, PrimaryColumn, CreateDateColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid";

@Entity("categories") // Definindo que nossa classe é uma entidade passando o nome da tabela
class Category {
    @PrimaryColumn() // definindo que o atributo é a chave primária da table
    id?: string;

    @Column()
    name: string;

    @Column() // Notation defines atribute as a Column in Database
    description: string;

    @CreateDateColumn()
    created_at: Date;

    // Veryfing if ID exists (Is a new object being created?)
    constructor() {
        if (!this.id) {
            this.id = uuidV4();
        }
    }
}

export { Category };
