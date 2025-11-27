import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TestDatabaseModule } from '../src/test/test-database.module';
import { Repository } from 'typeorm';
import { User } from '../src/user/entities/user.entity';
import { Book } from '../src/book/entities/book.entity';
import { Review } from '../src/review/entities/review.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileService } from '../src/profile/profile.service';
import { ProfileController } from '../src/profile/profile.controller';

describe('ProfileController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let userRepository: Repository<User>;
  let bookRepository: Repository<Book>;
  let publicUser: User;
  let privateUser: User;

  jest.setTimeout(30000);

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        TypeOrmModule.forFeature([User, Book, Review]),
      ],
      controllers: [ProfileController],
      providers: [ProfileService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    bookRepository = moduleFixture.get<Repository<Book>>(getRepositoryToken(Book));

    // Create public user
    publicUser = await userRepository.save({
      id: 'public-user-123',
      username: 'publicuser',
      first_name: 'Public',
      last_name: 'User',
      bio: 'I love reading!',
      isProfilePublic: true,
    });

    // Create private user
    privateUser = await userRepository.save({
      id: 'private-user-123',
      username: 'privateuser',
      first_name: 'Private',
      last_name: 'User',
      isProfilePublic: false,
    });

    // Create public book for public user
    await bookRepository.save({
      title: 'Public Book',
      coverImageUrl: 'https://example.com/cover.jpg',
      isPublic: true,
      user: publicUser,
    });
  }, 30000);

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('GET /api/profile/:username - Public Profile', () => {
    it('should return public profile data', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/profile/publicuser')
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('books');
      expect(response.body).toHaveProperty('stats');
      expect(response.body.user.username).toBe('publicuser');
      expect(response.body.user.first_name).toBe('Public');
    });

    it('should include public books in profile', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/profile/publicuser')
        .expect(200);

      expect(response.body.books.length).toBeGreaterThanOrEqual(1);
      expect(response.body.books.find((b: any) => b.title === 'Public Book')).toBeDefined();
    });

    it('should return 404 for private profile', async () => {
      await request(app.getHttpServer())
        .get('/api/profile/privateuser')
        .expect(404);
    });

    it('should return 404 for non-existent user', async () => {
      await request(app.getHttpServer())
        .get('/api/profile/nonexistentuser')
        .expect(404);
    });

    it('should not expose private books in public profile', async () => {
      // Add a private book
      await bookRepository.save({
        title: 'Private Book',
        coverImageUrl: 'https://example.com/cover2.jpg',
        isPublic: false,
        user: publicUser,
      });

      const response = await request(app.getHttpServer())
        .get('/api/profile/publicuser')
        .expect(200);

      // Should not have the private book
      const privateBook = response.body.books.find((b: any) => b.title === 'Private Book');
      expect(privateBook).toBeUndefined();
    });
  });
});
