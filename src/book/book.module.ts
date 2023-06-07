import { Module, forwardRef } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { ShelfModule } from 'src/shelf/shelf.module';
import { SupabaseService } from 'src/supabase/supabaseService';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports:[TypeOrmModule.forFeature([Book]), forwardRef(() => ShelfModule), JwtModule],
  exports: [TypeOrmModule, BookService],
  providers: [BookService, SupabaseService, JwtService],
  controllers: [BookController]
})
export class BookModule {}
