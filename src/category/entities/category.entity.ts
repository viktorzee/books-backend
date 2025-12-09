import { IsNotEmpty } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  name: string;

  // If user is null, this is a global/generic category visible to all users
  // If user is set, this category is only visible to that specific user
  @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  user: User | null;

  @Column({ default: false })
  isGlobal: boolean; // true for system-wide categories, false for user-created

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  isDeleted: boolean;

  @DeleteDateColumn()
  deletedAt: Date;
}
