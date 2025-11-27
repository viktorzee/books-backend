import { IsNotEmpty } from "class-validator";
import {
  CreateDateColumn,
  Column,
  Entity,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";

@Entity()
@Unique(["username"])
export class User {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ nullable: true })
  @IsNotEmpty()
  username: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true, type: "text" })
  bio: string;

  @Column({ default: false })
  isProfilePublic: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
