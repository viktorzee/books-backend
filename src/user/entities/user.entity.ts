import { IsNotEmpty } from "class-validator";
import { CreateDateColumn,Column, Entity, PrimaryColumn, Unique, UpdateDateColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@Unique(['username'])
export class User {
    @PrimaryColumn('uuid')
    id: string    

    @Column({nullable: true})
    @IsNotEmpty()
    username: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
