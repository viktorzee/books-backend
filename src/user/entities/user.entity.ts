import { IsNotEmpty } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['username', 'email'])
export class User {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    @IsNotEmpty()
    email: string

    @Column()
    @IsNotEmpty()
    username: string

    @Column()
    createdAt: Date

    @Column()
    updatedAt: Date
}
