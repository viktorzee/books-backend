import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Shelf } from './entities/shelf.entity';
import { Repository } from 'typeorm';
import validateObjectHelper from 'src/validator/validatorOjectHelper';

@Injectable()
export class ShelfService {
  constructor(
    @InjectRepository(Shelf)
    private readonly shelf: Repository<Shelf>
  ){}
  async create(data: Partial<Shelf>) {
    const toValidate = this.shelf.create(data);
    await validateObjectHelper(toValidate, Shelf);
    const newShelf = await this.shelf.save(toValidate);
    return newShelf;
  }

  async index() {
    return await this.shelf.find();
  }

  async show(id: string) {
    const foundShelf = await this.shelf.findOne({where: {id}});
    if (!foundShelf) {
      throw new NotFoundException('Shelf not found');
    }
    return foundShelf;
  }

  async update(id: string, data) {
    const foundShelf = await this.shelf.findOne({where: {id}});
    console.log(foundShelf)
    if (!foundShelf) {
      throw new NotFoundException('Shelf not found');
    }
    const update =  await this.shelf.update(id, data);
    return update
  }

  async remove(id: string) {
    return await this.shelf.delete(id);
  }
}
