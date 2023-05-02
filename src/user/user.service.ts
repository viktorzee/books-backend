import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config/dist';
import { SupabaseService } from 'src/supabase/supabaseService';
import { isEmail } from 'class-validator';

@Injectable()
export class UserService {
  
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
    const { id } = await this.supabase.createUser(data);
    const user = await this.users.save({ id });
    return user;
  
  }
}