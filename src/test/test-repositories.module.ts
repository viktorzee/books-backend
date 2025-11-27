import { Module } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Book } from '../book/entities/book.entity';
import { Shelf } from '../shelf/entities/shelf.entity';
import { Category } from '../category/entities/category.entity';
import { Review } from '../review/entities/review.entity';

const mockQueryBuilder = {
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  addSelect: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  execute: jest.fn().mockResolvedValue({ affected: 1 }),
  getMany: jest.fn().mockResolvedValue([]),
  getOne: jest.fn().mockResolvedValue(null),
  getRawOne: jest.fn().mockResolvedValue({ averageRating: '0', reviewCount: '0' }),
};

function createMockRepository() {
  return {
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(null),
    findByIds: jest.fn().mockResolvedValue([]),
    findOneBy: jest.fn().mockResolvedValue(null),
    create: jest.fn((entity) => entity),
    save: jest.fn((entity) => Promise.resolve({ id: 'mock-id', ...entity })),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    remove: jest.fn().mockResolvedValue({}),
    clear: jest.fn().mockResolvedValue(undefined),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };
}

@Module({
  providers: [
    {
      provide: getRepositoryToken(User),
      useValue: createMockRepository(),
    },
    {
      provide: getRepositoryToken(Book),
      useValue: createMockRepository(),
    },
    {
      provide: getRepositoryToken(Shelf),
      useValue: createMockRepository(),
    },
    {
      provide: getRepositoryToken(Category),
      useValue: createMockRepository(),
    },
    {
      provide: getRepositoryToken(Review),
      useValue: createMockRepository(),
    },
  ],
  exports: [
    getRepositoryToken(User),
    getRepositoryToken(Book),
    getRepositoryToken(Shelf),
    getRepositoryToken(Category),
    getRepositoryToken(Review),
  ],
})
export class TestRepositoriesModule {}
