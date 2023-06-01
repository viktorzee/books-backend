import { Controller, Post, Body, Get, Req, Param, Delete, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('/api/user/') // Tags for the controller
@Controller('/api/user/')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post('create')
  // @ApiResponse({ status: 200, description: 'Sign up a user' }) // Response description
  // create(@Body() data) {
  //   return this.userService.createUser(data);
  // }
  // @Post('login')
  // @ApiResponse({ status: 200, description: 'Sign up a user' }) // Response description
  // login(@Body() data) {
  //   return this.userService.login(data);
  // }

  @Get()
  index(@Req() req){
    const user = req.user;
    return this.userService.index(user)
  }

  @Get(':id')
  show(@Param('id') id: string) {
    return this.userService.show(id)
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Update specified shelf in storage' }) // Response description
  update(@Param('id') id: string, @Body() data) {
    return this.userService.update(id, data);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Remove specified shelf from storage' }) // Response description
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
