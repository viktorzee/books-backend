import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config/dist';

@Injectable()
export class UserService {
  private supabase: SupabaseClient;

  public get supabaseClient() {
    return this.supabase;
  }

  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private config: ConfigService
  ){
    this.initializeSupabase();
  }
  
  initializeSupabase() {
    const { key, url } = this.config.get<{ key: string; url: string }>('supabase');
    this.supabase = createClient(url, key);
}
async createUser(email: string, password: string){
        
  const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
  });
  if (error) {
  throw new Error(error.message);
}
  return data.user
}

  findAll() {
    return this.users.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
