import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('Books')
@Controller('/api/book/')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new book' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'The Great Gatsby' },
        description: { type: 'string', example: 'A classic novel' },
        coverImageUrl: { type: 'string', example: 'https://example.com/cover.jpg' },
        page_number: { type: 'number', example: 180 },
        categoryId: { type: 'string', example: 'uuid-here' },
      },
      required: ['title'],
    },
  })
  @ApiResponse({ status: 201, description: 'Book created successfully' })
  store(@Body() data, @Request() req) {
    return this.bookService.store({...data, user: { id: req.user.id }});
  }

  @Get('lists')
  @ApiOperation({ summary: 'Get all books for current user' })
  @ApiResponse({ status: 200, description: 'Returns list of books' })
  index(@Request() req) {
    const user = req.user
    return this.bookService.index(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single book by ID' })
  @ApiParam({ name: 'id', description: 'Book ID' })
  @ApiResponse({ status: 200, description: 'Returns the book' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  show(@Param('id') id: string) {
    return this.bookService.show(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a book' })
  @ApiParam({ name: 'id', description: 'Book ID' })
  @ApiResponse({ status: 200, description: 'Book updated successfully' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  update(@Param('id') id: string, @Body() data) {
    return this.bookService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a book (soft delete)' })
  @ApiParam({ name: 'id', description: 'Book ID' })
  @ApiResponse({ status: 200, description: 'Book deleted successfully' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  remove(@Param('id') id: string) {
    return this.bookService.remove(id);
  }

  @Patch(':id/visibility')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Toggle book public visibility' })
  @ApiParam({ name: 'id', description: 'Book ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        isPublic: { type: 'boolean', example: true },
      },
      required: ['isPublic'],
    },
  })
  @ApiResponse({ status: 200, description: 'Visibility updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  toggleVisibility(
    @Param('id') id: string,
    @Body() data: { isPublic: boolean },
    @Request() req
  ) {
    return this.bookService.toggleVisibility(id, data.isPublic, req.user.id);
  }
}
