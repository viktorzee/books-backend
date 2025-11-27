import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { Book } from '../book/entities/book.entity';
import { Shelf } from '../shelf/entities/shelf.entity';
import { Category } from '../category/entities/category.entity';
import { Review } from '../review/entities/review.entity';
import { SupabaseService } from '../supabase/supabaseService';
import { MockSupabaseService } from './mock-supabase.service';

// Set default test environment variables
function setupTestEnvironment() {
  const testEnv = {
    JWT_SECRET_KEY: process.env.TEST_JWT_SECRET || 'test-jwt-secret-key-12345',
    JWT_EXPIRATION: '24h',
    SUPABASE_URL: 'http://localhost:54321',
    SUPABASE_KEY: 'mock-supabase-key',
  };

  Object.entries(testEnv).forEach(([key, value]) => {
    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}

setupTestEnvironment();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      load: [
        () => ({
          supabase: {
            url: 'http://localhost:54321',
            key: 'mock-supabase-key',
          },
          secret: {
            JWT_SECRET_KEY: 'test-jwt-secret-key-12345',
          },
        }),
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: ':memory:',
        entities: [User, Book, Shelf, Category, Review],
        synchronize: true,
        autoLoadEntities: true,
        dropSchema: true,
        logging: false,
      }),
      inject: [ConfigService],
    }),
    JwtModule.register({
      secret: 'test-jwt-secret-key-12345',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    {
      provide: SupabaseService,
      useClass: MockSupabaseService,
    },
    JwtService,
  ],
  exports: [TypeOrmModule, SupabaseService, JwtModule, JwtService],
})
export class TestDatabaseModule {}
