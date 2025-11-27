import { Book } from "src/book/entities/book.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Shelf {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  isDeleted: boolean;

  @DeleteDateColumn()
  deletedAt: Date;
}
