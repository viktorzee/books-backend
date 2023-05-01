import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import dbConfig from './config/db.config';
import supabaseConfig from './config/supabase.config';

@Module({
  imports: [
    TypeOrmModule.forFeature(),
    ConfigModule.forRoot({
      load: [dbConfig, supabaseConfig]
    }),
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
