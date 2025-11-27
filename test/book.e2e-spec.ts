import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TestDatabaseModule } from '../src/test/test-database.module';
import { Repository } from 'typeorm';
import { Book } from '../src/book/entities/book.entity';
import { User } from '../src/user/entities/user.entity';
import { Shelf } from '../src/shelf/entities/shelf.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookService } from '../src/book/book.service';
import { BookController } from '../src/book/book.controller';

describe('BookController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let bookRepository: Repository<Book>;
  let userRepository: Repository<User>;
  let testUser: User;

  jest.setTimeout(30000);

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        TypeOrmModule.forFeature([Book, User, Shelf]),
      ],
      controllers: [BookController],
      providers: [BookService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    bookRepository = moduleFixture.get<Repository<Book>>(getRepositoryToken(Book));
    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));

    // Create test user
    testUser = await userRepository.save({
      id: 'test-user-123',
      username: 'testuser',
      first_name: 'Test',
      last_name: 'User',
    });
  }, 30000);

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  beforeEach(async () => {
    await bookRepository.clear();
  });

  describe('POST /api/book/create', () => {
    it('should create a new book', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/book/create')
        .send({
          title: 'Test Book',
          coverImageUrl: 'https://example.com/cover.jpg',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Test Book');
    });
  });

  describe('GET /api/book/lists', () => {
    it('should return list of books', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/book/lists')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/book/:id', () => {
    it('should return a single book', async () => {
      const book = await bookRepository.save({
        title: 'Test Book',
        coverImageUrl: 'https://example.com/cover.jpg',
        user: testUser,
      });

      const response = await request(app.getHttpServer())
        .get(`/api/book/${book.id}`)
        .expect(200);

      expect(response.body.title).toBe('Test Book');
    });

    it('should return 404 for non-existent book', async () => {
      await request(app.getHttpServer())
        .get('/api/book/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  describe('PATCH /api/book/:id', () => {
    it('should update a book', async () => {
      const book = await bookRepository.save({
        title: 'Original Title',
        coverImageUrl: 'https://example.com/cover.jpg',
        user: testUser,
      });

      await request(app.getHttpServer())
        .patch(`/api/book/${book.id}`)
        .send({ title: 'Updated Title' })
        .expect(200);

      const updatedBook = await bookRepository.findOne({ where: { id: book.id } });
      expect(updatedBook.title).toBe('Updated Title');
    });

    it('should return 404 for non-existent book', async () => {
      await request(app.getHttpServer())
        .patch('/api/book/00000000-0000-0000-0000-000000000000')
        .send({ title: 'Updated Title' })
        .expect(404);
    });
  });

  describe('DELETE /api/book/:id', () => {
    it('should delete a book', async () => {
      const book = await bookRepository.save({
        title: 'Test Book',
        coverImageUrl: 'https://example.com/cover.jpg',
        user: testUser,
      });

      await request(app.getHttpServer())
        .delete(`/api/book/${book.id}`)
        .expect(200);

      const deletedBook = await bookRepository.findOne({ where: { id: book.id } });
      expect(deletedBook).toBeNull();
    });
  });
});
