import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('/api/book/') // Tags for the controller
@Controller('/api/book/')
@UseGuards(AuthGuard)
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post('create')
  @ApiResponse({ status: 200, description: 'Store a newly created book in storage' }) // Response description
  store(@Body() data, @Request() req) {
    const userId = req.user;
    console.log(data, "data") 
    return this.bookService.store({...data, user: userId});
  }

  @Get('lists')
  @ApiResponse({ status: 200, description: 'Get listing of all books' }) // Response description
  index(@Request() req) {
    const user = req.user
    return this.bookService.index(user);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Display specified book' }) // Response description
  show(@Param('id') id: string) {
    return this.bookService.show(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Update specified book in storage' }) // Response description
  update(@Param('id') id: string, @Body() data) {
    console.log("UPDATE")
    return this.bookService.update(id, data);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Remove specified book from storage' }) // Response description
  remove(@Param('id') id: string) {
    return this.bookService.remove(id);
  }
}
