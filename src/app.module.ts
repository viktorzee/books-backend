import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import dbConfig from './config/db.config';
import supabaseConfig from './config/supabase.config';
import { AuthMiddleware } from './auth/auth.middleware';

@Module({
  imports: [ 
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath: ['.env.local', '.env'],
      load: [dbConfig, supabaseConfig]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const database = configService.get('database')
        console.log(database)
        return {
          ...configService.get('database'),
          autoLoadEntities: true,
          synchronize: true,
        }
      },
      inject: [ConfigService],
    }),
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer){
    consumer.apply(AuthMiddleware).forRoutes('*')
  }
}
