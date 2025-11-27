import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TestDatabaseModule } from '../src/test/test-database.module';
import { Repository } from 'typeorm';
import { Category } from '../src/category/entities/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from '../src/category/category.service';
import { CategoryController } from '../src/category/category.controller';

describe('CategoryController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let categoryRepository: Repository<Category>;

  jest.setTimeout(30000);

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        TypeOrmModule.forFeature([Category]),
      ],
      controllers: [CategoryController],
      providers: [CategoryService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    categoryRepository = moduleFixture.get<Repository<Category>>(getRepositoryToken(Category));
  }, 30000);

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  beforeEach(async () => {
    await categoryRepository.clear();
  });

  describe('GET /api/category/lists', () => {
    it('should return list of categories', async () => {
      await categoryRepository.save([
        { name: 'Fiction' },
        { name: 'Non-Fiction' },
        { name: 'Science' },
      ]);

      const response = await request(app.getHttpServer())
        .get('/api/category/lists')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(3);
    });

    it('should return empty array when no categories exist', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/category/lists')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('GET /api/category/:id', () => {
    it('should return a single category', async () => {
      const category = await categoryRepository.save({ name: 'Fiction' });

      const response = await request(app.getHttpServer())
        .get(`/api/category/${category.id}`)
        .expect(200);

      expect(response.body.name).toBe('Fiction');
    });

    it('should return 404 for non-existent category', async () => {
      await request(app.getHttpServer())
        .get('/api/category/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  describe('PATCH /api/category/:id', () => {
    it('should update a category', async () => {
      const category = await categoryRepository.save({ name: 'Original Name' });

      await request(app.getHttpServer())
        .patch(`/api/category/${category.id}`)
        .send({ name: 'Updated Name' })
        .expect(200);

      const updatedCategory = await categoryRepository.findOne({ where: { id: category.id } });
      expect(updatedCategory.name).toBe('Updated Name');
    });

    it('should return 404 for non-existent category', async () => {
      await request(app.getHttpServer())
        .patch('/api/category/00000000-0000-0000-0000-000000000000')
        .send({ name: 'Updated Name' })
        .expect(404);
    });
  });

  describe('DELETE /api/category/:id', () => {
    it('should delete a category', async () => {
      const category = await categoryRepository.save({ name: 'To Delete' });

      await request(app.getHttpServer())
        .delete(`/api/category/${category.id}`)
        .expect(200);

      const deletedCategory = await categoryRepository.findOne({ where: { id: category.id } });
      expect(deletedCategory).toBeNull();
    });
  });
});
