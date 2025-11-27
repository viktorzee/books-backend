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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from "@nestjs/swagger";
import { ReviewService } from "./review.service";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { AuthGuard } from "src/auth/auth.guard";

@ApiTags("Reviews")
@Controller("api/review")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post("create")
  @UseGuards(AuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Create a new review" })
  @ApiResponse({ status: 201, description: "Review created successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Book not found" })
  create(@Body() createReviewDto: CreateReviewDto, @Req() req: any) {
    return this.reviewService.create(createReviewDto, req.user.id);
  }

  @Get("book/:bookId")
  @ApiOperation({ summary: "Get all reviews for a book" })
  @ApiParam({ name: "bookId", description: "Book ID" })
  @ApiResponse({ status: 200, description: "Returns list of reviews" })
  findByBook(@Param("bookId") bookId: string) {
    return this.reviewService.findByBookId(bookId);
  }

  @Get("user")
  @UseGuards(AuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Get all reviews by current user" })
  @ApiResponse({ status: 200, description: "Returns user reviews" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  findByUser(@Req() req: any) {
    return this.reviewService.findByUserId(req.user.id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a single review by ID" })
  @ApiParam({ name: "id", description: "Review ID" })
  @ApiResponse({ status: 200, description: "Returns the review" })
  @ApiResponse({ status: 404, description: "Review not found" })
  findOne(@Param("id") id: string) {
    return this.reviewService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Update a review" })
  @ApiParam({ name: "id", description: "Review ID" })
  @ApiResponse({ status: 200, description: "Review updated successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Can only update own reviews" })
  @ApiResponse({ status: 404, description: "Review not found" })
  update(
    @Param("id") id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Req() req: any
  ) {
    return this.reviewService.update(id, updateReviewDto, req.user.id);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Delete a review" })
  @ApiParam({ name: "id", description: "Review ID" })
  @ApiResponse({ status: 200, description: "Review deleted successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Can only delete own reviews" })
  remove(@Param("id") id: string, @Req() req: any) {
    return this.reviewService.remove(id, req.user.id);
  }

  @Get("book/:bookId/stats")
  @ApiOperation({ summary: "Get review statistics for a book" })
  @ApiParam({ name: "bookId", description: "Book ID" })
  @ApiResponse({ status: 200, description: "Returns average rating and count" })
  getBookStats(@Param("bookId") bookId: string) {
    return this.reviewService.getBookReviewStats(bookId);
  }
}
