import { Injectable, NestMiddleware, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../supabase/supabaseService';
import { decode } from 'jsonwebtoken';
import secretConfig from 'src/config/secret.config';

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
                if(!token){
                    throw new HttpException('Authentication failed', HttpStatus.UNAUTHORIZED)
                }
                
                const decoded = this.jwt.verify(token, {secret: process.env.JWT_SECRET_KEY});
                const user = await this.supabaseService.getUserUsingToken(decoded.sub)
                const tokenExpired = new Date().getTime() >= decoded.exp * 1000; // Convert expiration time to milliseconds

                if(tokenExpired){
                    res.send(401).json({message: 'Token expired'})
                }

                if (user) {
                    req.user = user
                    next()
                } else {
                    throw new HttpException('Unathourized. Please log in', HttpStatus.UNAUTHORIZED)

                }            
            }else{
                next();
            }
        }catch {
         throw new HttpException('Unathourized. Please log in', HttpStatus.UNAUTHORIZED)
       }
    }
}