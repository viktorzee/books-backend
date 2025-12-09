import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import dbConfig from './config/db.config';
import supabaseConfig from './config/supabase.config';
import { AuthMiddleware } from './auth/auth.middleware';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { SupabaseService } from './supabase/supabaseService';
import { BookModule } from './book/book.module';
import { ShelfModule } from './shelf/shelf.module';
import { CategoryModule } from './category/category.module';
import secretConfig from './config/secret.config';
import { AuthModule } from './auth/auth.module';
import { ReviewModule } from './review/review.module';
import { ProfileModule } from './profile/profile.module';

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
      load: [dbConfig, supabaseConfig, secretConfig]
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService ) => {
        return{
          secret: configService.get<string>('secret.JWT_SECRET_KEY'),
          signOptions: {expiresIn: '3h'}
        }
      },
      inject: [ConfigService]
    }),
    AuthModule,
    UserModule,
    BookModule,
    ShelfModule,
    CategoryModule,
    ReviewModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService, SupabaseService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('/auth/create', '/auth/login', '/api/category/(.*)')
      .forRoutes('*');
  }
}
