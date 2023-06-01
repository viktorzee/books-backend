import { Module, forwardRef } from '@nestjs/common';
import { ShelfService } from './shelf.service';
import { ShelfController } from './shelf.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shelf } from './entities/shelf.entity';
import { BookModule } from 'src/book/book.module';
import { SupabaseService } from 'src/supabase/supabaseService';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Shelf]), forwardRef(() => BookModule), JwtModule],
  exports: [TypeOrmModule, ShelfService],
  providers: [ShelfService, SupabaseService, JwtService],
  controllers: [ShelfController]
})
export class ShelfModule {}
