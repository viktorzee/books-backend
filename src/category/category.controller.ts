import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiResponse, ApiTags, ApiBody, ApiOperation } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('api/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a user-specific category' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'My Custom Genre' }
      },
      required: ['name']
    }
  })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiResponse({ status: 409, description: 'Category already exists' })
  create(@Body() data: { name: string }, @Request() req) {
    return this.categoryService.createUserCategory(data.name, req.user.id);
  }

  @Get('lists')
  @ApiOperation({ summary: 'Get all categories (global + user-specific)' })
  @ApiResponse({ status: 200, description: 'Returns list of categories' })
  index(@Request() req) {
    // If user is authenticated, return global + user's categories
    // Otherwise, return only global categories
    if (req.user?.id) {
      return this.categoryService.findAllForUser(req.user.id);
    }
    return this.categoryService.findAllGlobal();
  }

  @Get('global')
  @ApiOperation({ summary: 'Get only global categories (no auth required)' })
  @ApiResponse({ status: 200, description: 'Returns list of global categories' })
  indexGlobal() {
    return this.categoryService.findAllGlobal();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific category' })
  @ApiResponse({ status: 200, description: 'Returns the category' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  show(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user-specific category' })
  @ApiResponse({ status: 200, description: 'Category updated' })
  @ApiResponse({ status: 403, description: 'Cannot modify global or other users categories' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  update(@Param('id') id: string, @Body() data: { name: string }, @Request() req) {
    return this.categoryService.update(id, data, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user-specific category' })
  @ApiResponse({ status: 200, description: 'Category deleted' })
  @ApiResponse({ status: 403, description: 'Cannot delete global or other users categories' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  remove(@Param('id') id: string, @Request() req) {
    return this.categoryService.remove(id, req.user?.id);
  }
}
