import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Review } from "./entities/review.entity";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { Book } from "src/book/entities/book.entity";

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>
  ) {}

  async create(createReviewDto: CreateReviewDto, userId: string): Promise<Review> {
    // Verify book exists
    const book = await this.bookRepository.findOne({
      where: { id: createReviewDto.bookId },
    });

    if (!book) {
      throw new NotFoundException("Book not found");
    }

    const review = this.reviewRepository.create({
      ...createReviewDto,
      userId,
    });

    return this.reviewRepository.save(review);
  }

  async findByBookId(bookId: string): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { bookId },
      relations: ["user"],
      order: { createdAt: "DESC" },
    });
  }

  async findByUserId(userId: string): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { userId },
      relations: ["book"],
      order: { createdAt: "DESC" },
    });
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ["user", "book"],
    });

    if (!review) {
      throw new NotFoundException("Review not found");
    }

    return review;
  }

  async update(
    id: string,
    updateReviewDto: UpdateReviewDto,
    userId: string
  ): Promise<Review> {
    const review = await this.findOne(id);

    if (review.userId !== userId) {
      throw new ForbiddenException("You can only update your own reviews");
    }

    Object.assign(review, updateReviewDto);
    return this.reviewRepository.save(review);
  }

  async remove(id: string, userId: string): Promise<{ success: boolean }> {
    const review = await this.findOne(id);

    if (review.userId !== userId) {
      throw new ForbiddenException("You can only delete your own reviews");
    }

    await this.reviewRepository.remove(review);
    return { success: true };
  }

  // Get review stats for a book
  async getBookReviewStats(bookId: string): Promise<{
    averageRating: number;
    reviewCount: number;
  }> {
    const reviews = await this.reviewRepository.find({
      where: { bookId },
    });

    if (reviews.length === 0) {
      return { averageRating: 0, reviewCount: 0 };
    }

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    return {
      averageRating: Math.round((totalRating / reviews.length) * 10) / 10,
      reviewCount: reviews.length,
    };
  }
}
