import { Book } from "src/book/entities/book.entity";
import { User } from "src/user/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Review {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  rating: number;

  @Column({ nullable: true })
  title: string;

  @Column("text")
  content: string;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Book, { onDelete: "CASCADE" })
  book: Book;

  @Column()
  bookId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
