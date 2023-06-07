import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { SupabaseService } from 'src/supabase/supabaseService';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly service:SupabaseService, private readonly jwt: JwtService){}
  async canActivate(
    context: ExecutionContext,
  ):  Promise<boolean>  {
    const request = await context.switchToHttp().getRequest();
    const authHeader = await request.headers.authorization;
    if (
     authHeader &&
      authHeader.startsWith('Bearer')
  ) {
    const token = await authHeader.split(' ')[1];
    const decoded = await this.jwt.verifyAsync(token, {
      secret: process.env.JWT_SECRET_KEY
    })
    const user = await this.service.client.auth.admin.getUserById(decoded.sub)

    if (request.query.isPublic) {
      return true;
    }
  
    if (!user) {
      throw new UnauthorizedException('Unauthorized. Please log in')
      // return false;
    }
  
    const userForReq = { id: user.data.user.id };
    request.user = userForReq    
    return true;
  }else{
    throw new HttpException('Unathourized. Please log in', HttpStatus.UNAUTHORIZED)
  }
    
  }
}
