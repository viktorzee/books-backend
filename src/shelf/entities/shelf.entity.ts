import { Book } from "src/book/entities/book.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Shelf {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @ManyToMany(() => Book, (book) => book.shelves, {eager: true})
    @JoinTable({
        name: 'shelf_books',
        joinColumn: {
        name: 'shelfId',
        referencedColumnName: 'id'
    },
    inverseJoinColumn: {
        name: 'bookId',
        referencedColumnName: 'id'
    }
  })
  books: Book[];
}
