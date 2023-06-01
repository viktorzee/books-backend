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

  async index(user: User) {
    // return await this.shelf.find();
    return this.shelf.find({
      where: {
        user
      },
      relations: ['user']
    });
  }

  async show(id: string) {
    const foundShelf = await this.shelf.findOne({where: {id}});
    if (!foundShelf) {
      throw new NotFoundException('Shelf not found');
    }
    return foundShelf;
  }

  async addBookToShelf(shelfId: string, bookId: string){
    //get shelf
    const shelf = await this.shelf.findOne({where: {id: shelfId}, relations: ['books']})
    //get book
    const book = await this.book.findOne({where: {id: bookId}})

    //check if book exist in shelf already
    const existingBook = shelf.books.find((b) => b.id === book.id);
    if(existingBook){
      throw new ConflictException(`This book ${book.title} already exist in this shelf`);
    }
    //else push book to the bookshelf
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
    return await this.shelf.delete(id);
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
