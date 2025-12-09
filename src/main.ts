import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { CategoryService } from './category/category.service';
import { categoryResource } from './category/entities/seedData';

// Use port number from the PORT environment variable or 3000 if not specified
const port = process.env.PORT || 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });
  app.enableCors();

  //class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: false
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('BookShelf API')
    .setDescription('API for managing books, shelves, reviews, and user profiles')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Books', 'Book management endpoints')
    .addTag('Shelves', 'Shelf management endpoints')
    .addTag('Reviews', 'Review management endpoints')
    .addTag('Categories', 'Category management endpoints')
    .addTag('Profile', 'User profile endpoints')
    .addTag('Auth', 'Authentication endpoints')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const categorySeeder = app.get(CategoryService);
  await categorySeeder.createGlobal(categoryResource);

  await app.listen(port);
}
bootstrap();
