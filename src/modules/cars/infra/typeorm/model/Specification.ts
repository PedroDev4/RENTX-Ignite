import { Entity, PrimaryColumn, Column, CreateDateColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid";

@Entity("specifications")
class Specification {
    @PrimaryColumn()
    id?: string;

    @Column()
    name: string;

    @Column()
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

export { Specification };
