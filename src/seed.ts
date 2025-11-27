import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Category } from './category/entities/category.entity';
import { categoryResource } from './category/entities/seedData';
import { User } from './user/entities/user.entity';
import { Book } from './book/entities/book.entity';
import { Shelf } from './shelf/entities/shelf.entity';
import { Review } from './review/entities/review.entity';

// Load environment variables
config({ path: '.env.local' });
config({ path: '.env' });

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DB_URL,
    port: Number(process.env.DB_PORT) || 5432,
    entities: [Category, User, Book, Shelf, Review],
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('Database connected');

    const categoryRepository = dataSource.getRepository(Category);

    // Check existing categories
    const existingCategories = await categoryRepository.find();
    const existingNames = existingCategories.map((c) => c.name);

    // Filter out categories that already exist
    const newCategories = categoryResource.filter(
      (name) => !existingNames.includes(name),
    );

    if (newCategories.length === 0) {
      console.log('All categories already exist. Nothing to seed.');
    } else {
      // Insert new categories
      const categoriesToInsert = newCategories.map((name) => ({
        name,
      }));

      await categoryRepository.save(categoriesToInsert);
      console.log(`Seeded ${newCategories.length} categories:`);
      newCategories.forEach((name) => console.log(`  - ${name}`));
    }

    console.log('\nSeeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

seed();
