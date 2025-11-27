import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from "@nestjs/common";
import { ReviewService } from "./review.service";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { AuthGuard } from "src/auth/auth.guard";

@Controller("api/review")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post("create")
  @UseGuards(AuthGuard)
  create(@Body() createReviewDto: CreateReviewDto, @Req() req: any) {
    return this.reviewService.create(createReviewDto, req.user.id);
  }

  @Get("book/:bookId")
  findByBook(@Param("bookId") bookId: string) {
    return this.reviewService.findByBookId(bookId);
  }

  @Get("user")
  @UseGuards(AuthGuard)
  findByUser(@Req() req: any) {
    return this.reviewService.findByUserId(req.user.id);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.reviewService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  update(
    @Param("id") id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Req() req: any
  ) {
    return this.reviewService.update(id, updateReviewDto, req.user.id);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  remove(@Param("id") id: string, @Req() req: any) {
    return this.reviewService.remove(id, req.user.id);
  }

  @Get("book/:bookId/stats")
  getBookStats(@Param("bookId") bookId: string) {
    return this.reviewService.getBookReviewStats(bookId);
  }
}
