import { Module } from '@nestjs/common';
import { ShelfService } from './shelf.service';
import { ShelfController } from './shelf.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shelf } from './entities/shelf.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shelf])],
  exports: [TypeOrmModule, ShelfService],
  controllers: [ShelfController],
  providers: [ShelfService]
})
export class ShelfModule {}
