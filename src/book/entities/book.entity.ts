import { Category } from "src/category/entities/category.entity";
import { Shelf } from "src/shelf/entities/shelf.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Book {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    page_number: number;

    @Column({
        type: 'date' ,
    })
    published_date: Date;

    @Column()
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

    @Column('simple-array', {nullable: true})
    tags: string[];

    @ManyToOne(() => User, (user) => user.id,)
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
