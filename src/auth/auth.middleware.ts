import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../supabase/supabaseService';

interface UserRequest extends Request {
    user: any
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly jwt: JwtService, private readonly supabaseService: SupabaseService) { }
    async use(req: UserRequest, res: Response, next: NextFunction) {
        try{

            if (
                req.headers.authorization &&
                req.headers.authorization.startsWith('Bearer')
            ) {
                const token = req.headers.authorization.split(' ')[1];
                const decoded = await this.jwt.verify(token);
                const user = await this.supabaseService.getUserUsingToken(decoded)
                console.log(user)
                if (user) {
                    req.user = user
                    next()
                } else {
                    throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)

                }            
            }
        }catch {
         throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
       }
    }
}