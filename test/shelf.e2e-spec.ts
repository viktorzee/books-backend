import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TestDatabaseModule } from '../src/test/test-database.module';
import { Repository } from 'typeorm';
import { Shelf } from '../src/shelf/entities/shelf.entity';
import { Book } from '../src/book/entities/book.entity';
import { User } from '../src/user/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShelfService } from '../src/shelf/shelf.service';
import { ShelfController } from '../src/shelf/shelf.controller';

describe('ShelfController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let shelfRepository: Repository<Shelf>;
  let bookRepository: Repository<Book>;
  let userRepository: Repository<User>;
  let testUser: User;
  let testBook: Book;

  jest.setTimeout(30000);

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        TypeOrmModule.forFeature([Shelf, Book, User]),
      ],
      controllers: [ShelfController],
      providers: [ShelfService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    shelfRepository = moduleFixture.get<Repository<Shelf>>(getRepositoryToken(Shelf));
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
    await shelfRepository.delete({});
  });

  describe('POST /api/shelf/create', () => {
    it('should create a new shelf', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/shelf/create')
        .send({
          name: 'Currently Reading',
          description: 'Books I am currently reading',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Currently Reading');
    });
  });

  describe('GET /api/shelf/lists', () => {
    it('should return list of shelves', async () => {
      await shelfRepository.save([
        { name: 'Currently Reading', user: testUser },
        { name: 'Want to Read', user: testUser },
      ]);

      const response = await request(app.getHttpServer())
        .get('/api/shelf/lists')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/shelf/:id', () => {
    it('should return a single shelf', async () => {
      const shelf = await shelfRepository.save({
        name: 'My Shelf',
        description: 'Test shelf',
        user: testUser,
      });

      const response = await request(app.getHttpServer())
        .get(`/api/shelf/${shelf.id}`)
        .expect(200);

      expect(response.body.name).toBe('My Shelf');
    });

    it('should return 404 for non-existent shelf', async () => {
      await request(app.getHttpServer())
        .get('/api/shelf/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  describe('PATCH /api/shelf/:id', () => {
    it('should update a shelf', async () => {
      const shelf = await shelfRepository.save({
        name: 'Original Name',
        user: testUser,
      });

      await request(app.getHttpServer())
        .patch(`/api/shelf/${shelf.id}`)
        .send({ name: 'Updated Name' })
        .expect(200);

      const updatedShelf = await shelfRepository.findOne({ where: { id: shelf.id } });
      expect(updatedShelf.name).toBe('Updated Name');
    });

    it('should return 404 for non-existent shelf', async () => {
      await request(app.getHttpServer())
        .patch('/api/shelf/00000000-0000-0000-0000-000000000000')
        .send({ name: 'Updated Name' })
        .expect(404);
    });
  });

  describe('DELETE /api/shelf/:id', () => {
    it('should delete a shelf', async () => {
      const shelf = await shelfRepository.save({
        name: 'To Delete',
        user: testUser,
      });

      await request(app.getHttpServer())
        .delete(`/api/shelf/${shelf.id}`)
        .expect(200);

      const deletedShelf = await shelfRepository.findOne({ where: { id: shelf.id } });
      expect(deletedShelf).toBeNull();
    });
  });

  describe('POST /api/shelf/add-book', () => {
    it('should add a book to shelf', async () => {
      const shelf = await shelfRepository.save({
        name: 'My Shelf',
        user: testUser,
        books: [],
      });

      await request(app.getHttpServer())
        .post('/api/shelf/add-book')
        .send({ shelfId: shelf.id, bookId: testBook.id })
        .expect(201);
    });
  });

  describe('POST /api/shelf/:id/remove-book', () => {
    it('should remove a book from shelf', async () => {
      const shelf = await shelfRepository.save({
        name: 'My Shelf',
        user: testUser,
        books: [testBook],
      });

      await request(app.getHttpServer())
        .post(`/api/shelf/${shelf.id}/remove-book`)
        .expect(201);
    });
  });
});
