import { IsNotEmpty } from "class-validator";
import { CreateDateColumn,Column, Entity, PrimaryColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity()
@Unique(['username'])
export class User {
    @PrimaryColumn()
    id: string    

    @Column({nullable: true})
    @IsNotEmpty()
    username: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
