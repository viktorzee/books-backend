import { Category } from "src/category/entities/category.entity";
import { Shelf } from "src/shelf/entities/shelf.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Book {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    page_number: number;

    @Column({ nullable: true })
    published_date: Date;

    @Column({ nullable: true })
    coverImageUrl: string;

    @ManyToOne(() => Category, (category) => category.id, {cascade: true})
    category: Category;

    @ManyToMany(() => Shelf, (shelf) => shelf.books)
    shelves: Shelf;

    @Column({default: 0, nullable: true})
    ratings:number;

    @Column({ default: false, nullable: true })
    isRead: boolean;

    @Column({ default: false, nullable: true })
    isFavorite: boolean;

    @Column({ default: false })
    isPublic: boolean;

    @Column('simple-array', {nullable: true})
    tags: string[];

    @ManyToOne(() => User, (user) => user.id,)
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
