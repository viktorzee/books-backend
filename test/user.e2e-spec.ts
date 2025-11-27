import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TestDatabaseModule } from '../src/test/test-database.module';
import { Repository } from 'typeorm';
import { User } from '../src/user/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '../src/user/user.controller';
import { UserService } from '../src/user/user.service';
import { NotFoundException } from '@nestjs/common';

// Mock UserService that doesn't depend on SupabaseService
const createMockUserService = (userRepo: Repository<User>) => ({
  index: () => userRepo.find(),
  show: async (id: string) => {
    const user = await userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  },
  findByUsername: (username: string) => userRepo.findOne({ where: { username } }),
});

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let userRepository: Repository<User>;

  jest.setTimeout(30000);

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        TypeOrmModule.forFeature([User]),
      ],
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useFactory: (userRepo: Repository<User>) => createMockUserService(userRepo),
          inject: [getRepositoryToken(User)],
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));

    // Seed test users
    await userRepository.save([
      {
        id: 'user-1',
        username: 'user1',
        first_name: 'User',
        last_name: 'One',
        isProfilePublic: true,
      },
      {
        id: 'user-2',
        username: 'user2',
        first_name: 'User',
        last_name: 'Two',
        isProfilePublic: false,
      },
    ]);
  }, 30000);

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('GET /api/user/:id', () => {
    it('should return a single user by ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/user/user-1')
        .expect(200);

      expect(response.body.username).toBe('user1');
      expect(response.body.first_name).toBe('User');
    });

    it('should return 404 for non-existent user', async () => {
      await request(app.getHttpServer())
        .get('/api/user/non-existent-id')
        .expect(404);
    });
  });
});
