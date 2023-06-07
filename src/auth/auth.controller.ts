import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('/auth/') // Tags for the controller
@Controller('/auth/')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create')
  @ApiResponse({ status: 200, description: 'Sign up a user' }) // Response description
  create(@Body() data) {
    return this.authService.createUser(data);
  }
  @Post('login')
  @ApiResponse({ status: 200, description: 'Login up a user' }) // Response description
  login(@Body() data) {
    return this.authService.login(data);
  }
}
