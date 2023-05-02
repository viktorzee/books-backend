import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import dbConfig from './config/db.config';
import supabaseConfig from './config/supabase.config';

@Module({
  imports: [ 
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath: ['.env.local', '.env'],
      load: [dbConfig, supabaseConfig]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService:ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [],
        autoLoadEntities: true,
        synchronize: true  
      }),
      inject: [ConfigService],
    }),
   
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
