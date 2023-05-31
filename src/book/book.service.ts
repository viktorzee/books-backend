import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import validateObjectHelper from 'src/validator/validatorOjectHelper';
import { Shelf } from 'src/shelf/entities/shelf.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private books: Repository<Book>,

    @InjectRepository(Shelf)
    private shelf: Repository<Shelf>
  ){}
  async store(book: Partial<Book>) : Promise<Book>{
    const toValidate = this.books.create(book);
    
    // await validateObjectHelper(toValidate, Book);
    const newBook = await this.books.save(toValidate);    
    return newBook;
  }

  async index(user: User) {
    return this.books.find({
      where: {
        user
      },
      relations: ['userId']
    });
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
    const book = await this.books.findOne({where: {id}});

    await this.shelf
      .createQueryBuilder()
      .delete()
      .from('shelf_books')
      .where('bookId = :bookId', { bookId: book.id })
      .execute();

    await this.books.remove(book);
  }
}
