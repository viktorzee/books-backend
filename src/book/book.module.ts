import { Module, forwardRef } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { ShelfModule } from 'src/shelf/shelf.module';

@Module({
  imports:[TypeOrmModule.forFeature([Book]), forwardRef(() => ShelfModule)],
  exports: [TypeOrmModule, BookService],
  providers: [BookService],
  controllers: [BookController]
})
export class BookModule {}
