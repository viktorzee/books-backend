import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { CategoryService } from './category/category.service';
import { categoryResource } from './category/entities/seedData';

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
  .setTitle('Your API Title')
  .setDescription('API description')
  .setVersion('1.0')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const categorySeeder = app.get(CategoryService);
  await categorySeeder.create(categoryResource);
 
  await app.listen(9000);
}
bootstrap();
