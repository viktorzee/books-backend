import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config/dist';
import { SupabaseService } from '../supabase/supabaseService';
import { isEmail } from 'class-validator';

@Injectable()
export class AuthService {
  
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private supabase: SupabaseService,
    private config: ConfigService
  ){}

  async createUser(data){
    // Validate email
    if (!isEmail(data.email)) {
      throw new Error('Invalid email');
    }

    const { username, first_name, last_name } = data;
    const { id } = await this.supabase.createUser(data);
    const user = await this.users.save({
      id,
      username,
      first_name,
      last_name
    });
    return user;
  }
  
  async login(data){
    const accessToken = await this.supabase.login(data);
    return accessToken;
  }
}