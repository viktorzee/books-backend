import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReviewService } from "./review.service";
import { ReviewController } from "./review.controller";
import { Review } from "./entities/review.entity";
import { Book } from "src/book/entities/book.entity";
import { AuthModule } from "src/auth/auth.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, Book]),
    AuthModule,
    JwtModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
