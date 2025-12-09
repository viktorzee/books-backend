import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('/api/user/') // Tags for the controller
@Controller('/api/user/')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, description: 'Get current authenticated user' })
  async getCurrentUser(@Req() req) {
    return this.userService.show(req.user.id);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Display specified user' })
  show(@Param('id') id: string) {
    return this.userService.show(id);
  }

}
