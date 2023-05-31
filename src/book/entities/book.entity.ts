import { Category } from "src/category/entities/category.entity";
import { Shelf } from "src/shelf/entities/shelf.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

    @ManyToMany(() => Category, (category) => category.book, {eager: true})
        @JoinTable({
            name: 'book_category',
            joinColumn: {
            name: 'bookId',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'categoryId',
            referencedColumnName: 'id'
        }
    })
    category: Category[];

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

    @ManyToOne(() => User, (user) => user.id)
    user: User;
}
