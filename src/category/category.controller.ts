import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('/api/category/') // Tags for the controller
@Controller('api/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Get listing of all categories' }) // Response description
  index() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Display specified category' }) // Response description
  show(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Update specified category in storage' }) // Response description
  update(@Param('id') id: string, @Body() data) {
    return this.categoryService.update(id, data);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Remove specified category from storage' }) // Response description
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
