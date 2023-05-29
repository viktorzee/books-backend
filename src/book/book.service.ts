import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import validateObjectHelper from 'src/validator/validatorOjectHelper';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private books: Repository<Book>
  ){}
  async store(book: Partial<Book>) : Promise<Book>{
    const toValidate = this.books.create(book);
    
    // await validateObjectHelper(toValidate, Book);
    const newBook = await this.books.save(toValidate);    
    return newBook;
  }

  async index() {
    return await this.books.find();
  }

  async show(id: string) {
    const foundBook = await this.books.findOne({where: {id}});
    if (!foundBook) {
      throw new NotFoundException('Book not found');
    }
    return foundBook;
  }

  async update(id: string, data: Partial<Book>) {
    const foundBook = await this.books.findOne({where: {id}});
    if (!foundBook) {
      throw new NotFoundException('Book not found');
    }
    const update = await this.books.update(id, data)

    return update;

  }

  async remove(id: string) {
    return await this.books.delete(id)
  }
}
