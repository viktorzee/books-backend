import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import dbConfig from './config/db.config';
import supabaseConfig from './config/supabase.config';
import { AuthMiddleware } from './auth/auth.middleware';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from './supabase/supabaseService';
import { BookModule } from './book/book.module';
import { ShelfModule } from './shelf/shelf.module';

@Module({
  imports: [ 
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
            ...configService.get('database'),
            entities: [],
            autoLoadEntities: true,
            synchronize: true,
         }
        },
      inject: [ConfigService],
    }),    
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath: ['.env.local', '.env'],
      load: [dbConfig, supabaseConfig]
    }),
    UserModule,
    BookModule,
    ShelfModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService, SupabaseService],
})
export class AppModule{
   configure(consumer: MiddlewareConsumer){
    consumer.apply(AuthMiddleware).forRoutes('*')
  }

}
