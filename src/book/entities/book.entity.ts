import { Shelf } from "src/shelf/entities/shelf.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @ManyToMany(() => Shelf, (shelf) => shelf.books)
    shelves: Shelf;

    @Column({default: 0, nullable: true})
    ratings:number;

    @Column({ default: false, nullable: true })
    isRead: boolean;

    @Column({ default: false, nullable: true })
    isFavorite: boolean;

    @Column('simple-array', {nullable: true})
    tags: string[];
}
