import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Shelf } from './entities/shelf.entity';
import { Repository } from 'typeorm';
import validateObjectHelper from 'src/validator/validatorOjectHelper';
import { Book } from 'src/book/entities/book.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ShelfService {
  constructor(
    @InjectRepository(Shelf)
    private readonly shelf: Repository<Shelf>,
    @InjectRepository(Book)
    private readonly book: Repository<Book>
  ){}
  async create(data: Partial<Shelf>) {
    const toValidate = this.shelf.create(data);
    // await validateObjectHelper(toValidate, Shelf);
    const newShelf = await this.shelf.save(toValidate);
    return newShelf;
  }

  async index(user: { id: string }, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [shelves, total] = await this.shelf.findAndCount({
      where: {
        user: { id: user.id }
      },
      relations: ['user', 'books'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' }
    });

    return {
      data: shelves,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    };
  }

  async show(id: string) {
    const foundShelf = await this.shelf.findOneBy({id});
    if (!foundShelf) {
      throw new NotFoundException('Shelf not found');
    }
    return foundShelf;
  }

  async addBookToShelf(data){
    const {bookId, shelfId} = data
    //get shelf with books relation
    const shelf = await this.shelf.findOne({where: {id: shelfId}, relations: ['books']})
    if (!shelf) {
      throw new NotFoundException('Shelf not found');
    }
    //get book
    const book = await this.book.findOne({where: {id: bookId}})
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    //check if book exist in shelf already
    let existingBook = shelf.books?.find(b => b.id === bookId)
    if(existingBook){
      throw new ConflictException(`This book "${book.title}" already exist in this shelf`);
    }
    //else push book to the bookshelf
    if (!shelf.books) {
      shelf.books = [];
    }
    shelf.books.push(book)
    return await this.shelf.save(shelf)
  }

  async update(id: string, data) {
    const foundShelf = await this.shelf.findOne({where: {id}});
    if (!foundShelf) {
      throw new NotFoundException('Shelf not found');
    }
    const update =  await this.shelf.update(id, data);
    return update
  }

  async remove(id: string) {
    const shelf = await this.shelf.findOne({ where: { id } });
    if (!shelf) {
      throw new NotFoundException('Shelf not found');
    }
    // Soft delete
    await this.shelf.update(id, { isDeleted: true });
    return await this.shelf.softDelete(id);
  }

  async removeBook(bookId:string, shelfId:string){
    const shelf = await this.shelf.findOne({where: {id: shelfId}, relations: ['books']});

    const book = await this.book.findOne({where: {id: bookId}});
    
    if (!book) {
      // Book not found
      throw new Error('Book not found');
    }

    if (!shelf) {
      // Shelf not found
      throw new Error('Shelf not found');
    }

    shelf.books = shelf.books.filter((b) => b.id !== book.id);
    return await this.shelf.save(shelf)
  }
}
