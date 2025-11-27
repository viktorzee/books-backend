import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSoftDelete1701200000000 implements MigrationInterface {
  name = 'AddSoftDelete1701200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add soft delete columns to user table
    await queryRunner.query(`
      ALTER TABLE "user"
      ADD COLUMN IF NOT EXISTS "isDeleted" boolean NOT NULL DEFAULT false,
      ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP
    `);

    // Add soft delete columns to book table
    await queryRunner.query(`
      ALTER TABLE "book"
      ADD COLUMN IF NOT EXISTS "isDeleted" boolean NOT NULL DEFAULT false,
      ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP
    `);

    // Add soft delete columns to shelf table
    await queryRunner.query(`
      ALTER TABLE "shelf"
      ADD COLUMN IF NOT EXISTS "isDeleted" boolean NOT NULL DEFAULT false,
      ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP
    `);

    // Add soft delete columns to category table
    await queryRunner.query(`
      ALTER TABLE "category"
      ADD COLUMN IF NOT EXISTS "isDeleted" boolean NOT NULL DEFAULT false,
      ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP
    `);

    // Add soft delete columns to review table
    await queryRunner.query(`
      ALTER TABLE "review"
      ADD COLUMN IF NOT EXISTS "isDeleted" boolean NOT NULL DEFAULT false,
      ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP
    `);

    // Create indexes for soft delete queries
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_user_isDeleted" ON "user" ("isDeleted")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_book_isDeleted" ON "book" ("isDeleted")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_shelf_isDeleted" ON "shelf" ("isDeleted")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_category_isDeleted" ON "category" ("isDeleted")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_review_isDeleted" ON "review" ("isDeleted")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_review_isDeleted"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_category_isDeleted"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_shelf_isDeleted"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_book_isDeleted"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_user_isDeleted"`);

    // Remove soft delete columns
    await queryRunner.query(`ALTER TABLE "review" DROP COLUMN IF EXISTS "deletedAt", DROP COLUMN IF EXISTS "isDeleted"`);
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN IF EXISTS "deletedAt", DROP COLUMN IF EXISTS "isDeleted"`);
    await queryRunner.query(`ALTER TABLE "shelf" DROP COLUMN IF EXISTS "deletedAt", DROP COLUMN IF EXISTS "isDeleted"`);
    await queryRunner.query(`ALTER TABLE "book" DROP COLUMN IF EXISTS "deletedAt", DROP COLUMN IF EXISTS "isDeleted"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "deletedAt", DROP COLUMN IF EXISTS "isDeleted"`);
  }
}
