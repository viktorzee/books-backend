import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TestDatabaseModule } from '../src/test/test-database.module';
import { Repository } from 'typeorm';
import { Review } from '../src/review/entities/review.entity';
import { Book } from '../src/book/entities/book.entity';
import { User } from '../src/user/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewService } from '../src/review/review.service';
import { ReviewController } from '../src/review/review.controller';

describe('ReviewController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let reviewRepository: Repository<Review>;
  let bookRepository: Repository<Book>;
  let userRepository: Repository<User>;
  let testUser: User;
  let testBook: Book;

  jest.setTimeout(30000);

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        TypeOrmModule.forFeature([Review, Book, User]),
      ],
      controllers: [ReviewController],
      providers: [ReviewService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    reviewRepository = moduleFixture.get<Repository<Review>>(getRepositoryToken(Review));
    bookRepository = moduleFixture.get<Repository<Book>>(getRepositoryToken(Book));
    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));

    // Create test user
    testUser = await userRepository.save({
      id: 'test-user-123',
      username: 'testuser',
      first_name: 'Test',
      last_name: 'User',
    });

    // Create test book
    testBook = await bookRepository.save({
      title: 'Test Book',
      coverImageUrl: 'https://example.com/cover.jpg',
      user: testUser,
    });
  }, 30000);

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  beforeEach(async () => {
    await reviewRepository.clear();
  });

  // Note: POST /api/review/create requires AuthGuard, tested separately with auth

  describe('GET /api/review/book/:bookId', () => {
    it('should return reviews for a book', async () => {
      await reviewRepository.save({
        bookId: testBook.id,
        userId: testUser.id,
        rating: 5,
        title: 'Test Review',
        content: 'Test content',
        user: testUser,
        book: testBook,
      });

      const response = await request(app.getHttpServer())
        .get(`/api/review/book/${testBook.id}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return empty array for book with no reviews', async () => {
      const newBook = await bookRepository.save({
        title: 'Another Book',
        coverImageUrl: 'https://example.com/cover2.jpg',
        user: testUser,
      });

      const response = await request(app.getHttpServer())
        .get(`/api/review/book/${newBook.id}`)
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('GET /api/review/book/:bookId/stats', () => {
    it('should return book review statistics', async () => {
      await reviewRepository.save({
        bookId: testBook.id,
        userId: testUser.id,
        rating: 5,
        content: 'Great!',
        user: testUser,
        book: testBook,
      });

      const response = await request(app.getHttpServer())
        .get(`/api/review/book/${testBook.id}/stats`)
        .expect(200);

      expect(response.body).toHaveProperty('averageRating');
      expect(response.body).toHaveProperty('reviewCount');
    });
  });

  describe('GET /api/review/:id', () => {
    it('should return a single review', async () => {
      const review = await reviewRepository.save({
        bookId: testBook.id,
        userId: testUser.id,
        rating: 5,
        title: 'Test Review',
        content: 'Test content',
        user: testUser,
        book: testBook,
      });

      const response = await request(app.getHttpServer())
        .get(`/api/review/${review.id}`)
        .expect(200);

      expect(response.body.title).toBe('Test Review');
    });

    it('should return 404 for non-existent review', async () => {
      await request(app.getHttpServer())
        .get('/api/review/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  // Note: PATCH /api/review/:id and DELETE /api/review/:id require AuthGuard
  // These endpoints are tested separately with authentication
});
