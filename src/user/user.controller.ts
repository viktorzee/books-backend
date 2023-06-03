import { Controller, Get, Param } from '@nestjs/common';
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

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Display specified user' }) // Response description
  show(@Param('id') id: string) {
    return this.userService.show(id);
  }

}
