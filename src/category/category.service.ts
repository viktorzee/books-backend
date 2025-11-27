import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categories: Repository<Category>
  ){}
  async create(data: string[]): Promise<void> {
    const existingcategories = await this.categories.find();
    const newGenres = data.filter((category) =>
      existingcategories.every((existingcategory) => existingcategory.name !== category),
    );

    const genreEntities = newGenres.map((genre) => this.categories.create({ name: genre }));
    await this.categories.save(genreEntities);
  }

  async findAll() {
    return await this.categories.find();
  }

  async findOne(id: string) {
    const foundCategory = await this.categories.findOne({where: {id}});
    if(!foundCategory){
      throw new NotFoundException("Category Not found")
    }
    return foundCategory;
  }

  async update(id: string, data) {
    const foundCategory = await this.categories.findOne({where: {id}});
    if(!foundCategory){
      throw new NotFoundException("Category Not found")
    }
    const update = await this.categories.update(id, data)
    return update;
  }

  async remove(id: string) {
    const category = await this.categories.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    // Soft delete
    await this.categories.update(id, { isDeleted: true });
    return await this.categories.softDelete(id);
  }
}
