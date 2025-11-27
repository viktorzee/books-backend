import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1701000000000 implements MigrationInterface {
  name = 'InitialSchema1701000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable uuid-ossp extension for UUID generation
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create User table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user" (
        "id" uuid NOT NULL,
        "username" character varying,
        "first_name" character varying,
        "last_name" character varying,
        "bio" text,
        "isProfilePublic" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_user_username" UNIQUE ("username"),
        CONSTRAINT "PK_user" PRIMARY KEY ("id")
      )
    `);

    // Create Category table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "category" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_category" PRIMARY KEY ("id")
      )
    `);

    // Create Book table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "book" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "description" character varying,
        "page_number" integer,
        "published_date" TIMESTAMP,
        "coverImageUrl" character varying,
        "ratings" integer DEFAULT 0,
        "isRead" boolean DEFAULT false,
        "isFavorite" boolean DEFAULT false,
        "isPublic" boolean NOT NULL DEFAULT false,
        "tags" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "categoryId" uuid,
        "userId" uuid,
        CONSTRAINT "PK_book" PRIMARY KEY ("id")
      )
    `);

    // Create Shelf table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "shelf" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "description" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "userId" uuid,
        CONSTRAINT "PK_shelf" PRIMARY KEY ("id")
      )
    `);

    // Create Review table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "review" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "rating" integer NOT NULL,
        "title" character varying,
        "content" text NOT NULL,
        "userId" character varying NOT NULL,
        "bookId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_review" PRIMARY KEY ("id")
      )
    `);

    // Create shelf_books junction table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "shelf_books" (
        "shelfId" uuid NOT NULL,
        "bookId" uuid NOT NULL,
        CONSTRAINT "PK_shelf_books" PRIMARY KEY ("shelfId", "bookId")
      )
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "book"
      ADD CONSTRAINT "FK_book_category" FOREIGN KEY ("categoryId")
      REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "book"
      ADD CONSTRAINT "FK_book_user" FOREIGN KEY ("userId")
      REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "shelf"
      ADD CONSTRAINT "FK_shelf_user" FOREIGN KEY ("userId")
      REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "review"
      ADD CONSTRAINT "FK_review_book" FOREIGN KEY ("bookId")
      REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "shelf_books"
      ADD CONSTRAINT "FK_shelf_books_shelf" FOREIGN KEY ("shelfId")
      REFERENCES "shelf"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "shelf_books"
      ADD CONSTRAINT "FK_shelf_books_book" FOREIGN KEY ("bookId")
      REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);

    // Create indexes
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_shelf_books_shelfId" ON "shelf_books" ("shelfId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_shelf_books_bookId" ON "shelf_books" ("bookId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_book_userId" ON "book" ("userId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_review_bookId" ON "review" ("bookId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_review_userId" ON "review" ("userId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_review_userId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_review_bookId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_book_userId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_shelf_books_bookId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_shelf_books_shelfId"`);

    // Drop foreign key constraints
    await queryRunner.query(
      `ALTER TABLE "shelf_books" DROP CONSTRAINT IF EXISTS "FK_shelf_books_book"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shelf_books" DROP CONSTRAINT IF EXISTS "FK_shelf_books_shelf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT IF EXISTS "FK_review_book"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shelf" DROP CONSTRAINT IF EXISTS "FK_shelf_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "book" DROP CONSTRAINT IF EXISTS "FK_book_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "book" DROP CONSTRAINT IF EXISTS "FK_book_category"`,
    );

    // Drop tables
    await queryRunner.query(`DROP TABLE IF EXISTS "shelf_books"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "review"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "shelf"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "book"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "category"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user"`);
  }
}
