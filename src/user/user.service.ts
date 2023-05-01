import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config/dist';
import { SupabaseService } from 'src/supabase/supabaseService';

@Injectable()
export class UserService {
  
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private supabase: SupabaseService,
    private config: ConfigService
  ){}

async createUser(email:string, password:string){
        
  const { data, error } = await this.supabase.client.auth.signUp({
    email,
    password
  })
  if (error) {
    throw new Error(error.message);
  }
    return data.user
  }
 
}
