import {
  CreateDateColumn,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { User } from "../../user/entities/user.entity";

export enum ActivityType {
  CREATE_BOOK = 'Create Book',
  UPDATE_BOOK = 'Update Book',
  DELETE_BOOK = 'Delete Book',
  CREATE_SHELF = 'Create Shelf',
  UPDATE_SHELF = 'Update Shelf',
  DELETE_SHELF = 'Delete Shelf',
  ADD_BOOK_TO_SHELF = 'Add Book to Shelf',
}

@Entity()
export class Activity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: ActivityType,
  })
  type: ActivityType;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({ nullable: true })
  entityId: string;

  @Column({ nullable: true })
  entityName: string;

  @CreateDateColumn()
  createdAt: Date;
}
