import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ShelfService } from './shelf.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('/api/shelf/') // Tags for the controller
@Controller('/api/shelf/')
export class ShelfController {
  constructor(
    private readonly shelfService: ShelfService
  ) {}

  @Post('create')
  @ApiResponse({ status: 200, description: 'Store a newly created shelf in storage' }) // Response description
  create(@Body() data) {
    return this.shelfService.create(data);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Get listing of all shelves' }) // Response description
  index() {
    return this.shelfService.index();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Display specified shelf' }) // Response description
  show(@Param('id') id: string) {
    return this.shelfService.show(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Update specified shelf in storage' }) // Response description
  update(@Param('id') id: string, @Body() data) {
    return this.shelfService.update(id, data);
  }
  @Post(':id/add-book')
  @ApiResponse({ status: 200, description: 'Add a specified book to a shelf' }) // Response description
  async addBook(@Param('id') shelfId: string, @Body('bookId') bookId: string) {
    return await this.shelfService.addBookToShelf(shelfId, bookId);
  }

  @Post(':id/remove-book')
  @ApiResponse({ status: 200, description: 'Remove a specified book to a shelf' }) // Response description
  async removeBook(@Param('shelfId') shelfId: string,
  @Param('bookId') bookId: string,) {
    try {
      await this.shelfService.removeBook(bookId, shelfId);
      return;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Remove specified shelf from storage' }) // Response description
  remove(@Param('id') id: string) {
    return this.shelfService.remove(id);
  }
}
