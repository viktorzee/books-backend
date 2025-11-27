import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { Book } from "src/book/entities/book.entity";
import { Review } from "src/review/entities/review.entity";

export interface PublicBookType {
  id: string;
  title: string;
  coverImageUrl: string;
  category?: string;
  reviewCount: number;
  averageRating: number;
  userReview?: {
    id: string;
    rating: number;
    title?: string;
    content: string;
    createdAt: Date;
  };
}

export interface PublicProfileType {
  user: {
    username: string;
    first_name?: string;
    last_name?: string;
    bio?: string;
    createdAt?: Date;
  };
  books: PublicBookType[];
  stats: {
    totalBooks: number;
    totalReviews: number;
  };
}

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>
  ) {}

  async getPublicProfile(username: string): Promise<PublicProfileType> {
    // Find user by username
    const user = await this.userRepository.findOne({
      where: { username, isProfilePublic: true },
    });

    if (!user) {
      throw new NotFoundException("Profile not found or is private");
    }

    // Get user's public books
    const books = await this.bookRepository.find({
      where: { user: { id: user.id }, isPublic: true },
      relations: ["category"],
      order: { createdAt: "DESC" },
    });

    // Get user's reviews
    const userReviews = await this.reviewRepository.find({
      where: { userId: user.id },
    });

    // Build public books with review info
    const publicBooks: PublicBookType[] = await Promise.all(
      books.map(async (book) => {
        // Get review stats for this book
        const allReviews = await this.reviewRepository.find({
          where: { bookId: book.id },
        });

        const reviewCount = allReviews.length;
        const averageRating =
          reviewCount > 0
            ? Math.round(
                (allReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount) * 10
              ) / 10
            : 0;

        // Get user's review for this book
        const userReview = userReviews.find((r) => r.bookId === book.id);

        return {
          id: book.id,
          title: book.title,
          coverImageUrl: book.coverImageUrl,
          category: book.category?.name,
          reviewCount,
          averageRating,
          userReview: userReview
            ? {
                id: userReview.id,
                rating: userReview.rating,
                title: userReview.title,
                content: userReview.content,
                createdAt: userReview.createdAt,
              }
            : undefined,
        };
      })
    );

    return {
      user: {
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        bio: user.bio,
        createdAt: user.createdAt,
      },
      books: publicBooks,
      stats: {
        totalBooks: publicBooks.length,
        totalReviews: userReviews.length,
      },
    };
  }

  async updateProfile(
    userId: string,
    updateData: { bio?: string; isProfilePublic?: boolean; first_name?: string; last_name?: string }
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  async getMyProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }
}
