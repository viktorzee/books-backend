import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShelfService } from './shelf.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('/api/shelf/') // Tags for the controller
@Controller('/api/shelf/')
export class ShelfController {
  constructor(
    private readonly shelfService: ShelfService
  ) {}

  @Post('create')
  create(@Body() data) {
    return this.shelfService.create(data);
  }

  @Get()
  index() {
    return this.shelfService.index();
  }

  @Get(':id')
  show(@Param('id') id: string) {
    return this.shelfService.show(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data) {
    return this.shelfService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shelfService.remove(id);
  }
}
