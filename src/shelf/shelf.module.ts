import { Module, forwardRef } from '@nestjs/common';
import { ShelfService } from './shelf.service';
import { ShelfController } from './shelf.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shelf } from './entities/shelf.entity';
import { BookModule } from 'src/book/book.module';

@Module({
  imports: [TypeOrmModule.forFeature([Shelf]), forwardRef(() => BookModule)],
  exports: [TypeOrmModule, ShelfService],
  providers: [ShelfService],
  controllers: [ShelfController]
})
export class ShelfModule {}
