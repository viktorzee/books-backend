import { Book } from "src/book/entities/book.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: string;
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: string;
}
