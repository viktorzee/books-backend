import {
    BadRequestException,
    Injectable,
    Logger,
    UnauthorizedException,
  } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';
  import {
    AdminUserAttributes,
    createClient,
    SupabaseClient,
  } from '@supabase/supabase-js';
  
  @Injectable()
  export class SupabaseService {
    public client: SupabaseClient;
    private readonly logger = new Logger(SupabaseService.name);
  
    constructor(private readonly config: ConfigService) {
      this.initializeSupabase();
    }
  
    private initializeSupabase() {
      const { key, url } = this.config.get('supabase');
      this.client = createClient(url, key);
    }
  
    public async createUser(user: Partial<AdminUserAttributes>) {
      try {
        const { data, error } = await this.client.auth.admin.createUser({
          ...user,
          email_confirm: true,
        });
        if (error) {
          throw new Error(error.message);
        }
        const {
          user: { id },
        } = data;
        return { id };
      } catch (error) {
        this.logger.error(error);
        throw new BadRequestException(error.message ||  'Something went wrong and we could not create your account. Please try again.',);
      }
    }
  
    public async getUserUsingToken(token: string) {
      const { error, data } = await this.client.auth.getUser(token);
      if (error) {
        this.logger.error(error);
        throw new UnauthorizedException(
          'Failed to verify user. Please login again.',
        );
      }
      const { user } = data;
      return user;
    }
  }