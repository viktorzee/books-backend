import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository, IsNull } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categories: Repository<Category>
  ){}

  // Create global/seed categories (for admin use)
  async createGlobal(data: string[]): Promise<void> {
    const existingcategories = await this.categories.find({ where: { isGlobal: true } });
    const newGenres = data.filter((category) =>
      existingcategories.every((existingcategory) => existingcategory.name !== category),
    );

    const genreEntities = newGenres.map((genre) => this.categories.create({
      name: genre,
      isGlobal: true,
      user: null
    }));
    await this.categories.save(genreEntities);
  }

  // Create a user-specific category
  async createUserCategory(name: string, userId: string): Promise<Category> {
    // Check if user already has a category with this name
    const existingUserCategory = await this.categories.findOne({
      where: {
        name,
        user: { id: userId }
      }
    });

    if (existingUserCategory) {
      throw new ConflictException(`You already have a category named "${name}"`);
    }

    // Check if there's a global category with this name
    const existingGlobalCategory = await this.categories.findOne({
      where: {
        name,
        isGlobal: true
      }
    });

    if (existingGlobalCategory) {
      throw new ConflictException(`A category named "${name}" already exists`);
    }

    const newCategory = this.categories.create({
      name,
      user: { id: userId },
      isGlobal: false
    });

    return await this.categories.save(newCategory);
  }

  // Get all categories visible to a user (global + user's own)
  async findAllForUser(userId: string) {
    return await this.categories.find({
      where: [
        { isGlobal: true },
        { user: { id: userId } }
      ],
      order: { isGlobal: 'DESC', name: 'ASC' }
    });
  }

  // Get all global categories (public endpoint, no auth required)
  async findAllGlobal() {
    return await this.categories.find({
      where: { isGlobal: true },
      order: { name: 'ASC' }
    });
  }

  async findOne(id: string) {
    const foundCategory = await this.categories.findOne({
      where: { id },
      relations: ['user']
    });
    if(!foundCategory){
      throw new NotFoundException("Category Not found")
    }
    return foundCategory;
  }

  async update(id: string, data: Partial<Category>, userId?: string) {
    const foundCategory = await this.categories.findOne({
      where: { id },
      relations: ['user']
    });

    if(!foundCategory){
      throw new NotFoundException("Category Not found")
    }

    // Only allow updating user's own categories (not global ones)
    if (foundCategory.isGlobal) {
      throw new ForbiddenException("Cannot modify global categories");
    }

    if (foundCategory.user?.id !== userId) {
      throw new ForbiddenException("You can only modify your own categories");
    }

    const update = await this.categories.update(id, { name: data.name });
    return update;
  }

  async remove(id: string, userId?: string) {
    const category = await this.categories.findOne({
      where: { id },
      relations: ['user']
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Only allow deleting user's own categories (not global ones)
    if (category.isGlobal) {
      throw new ForbiddenException("Cannot delete global categories");
    }

    if (category.user?.id !== userId) {
      throw new ForbiddenException("You can only delete your own categories");
    }

    // Soft delete
    await this.categories.update(id, { isDeleted: true });
    return await this.categories.softDelete(id);
  }
}
