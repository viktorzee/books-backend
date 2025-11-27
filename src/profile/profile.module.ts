import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProfileService } from "./profile.service";
import { ProfileController } from "./profile.controller";
import { User } from "src/user/entities/user.entity";
import { Book } from "src/book/entities/book.entity";
import { Review } from "src/review/entities/review.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Book, Review])],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
