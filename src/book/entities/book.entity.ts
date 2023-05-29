import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Book {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    published_date: string;

    @Column()
    coverImageUrl: string;

    @Column()
    shelfId: string;

    @Column({default: 0, nullable: true})
    ratings:number;

    @Column({ default: false, nullable: true })
    isRead: boolean;

    @Column({ default: false, nullable: true })
    isFavorite: boolean;

    @Column('simple-array', {nullable: true})
    tags: string[];
}
