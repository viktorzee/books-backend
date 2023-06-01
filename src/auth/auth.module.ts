import { Module } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { User } from '../user/entities/user.entity';
import { SupabaseService } from 'src/supabase/supabaseService';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  exports: [UserService],
  controllers: [AuthController],
  providers: [AuthService, UserService, SupabaseService, ConfigService]
})
export class AuthModule {}
