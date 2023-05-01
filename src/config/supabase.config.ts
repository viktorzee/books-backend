import { registerAs } from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm'

export default registerAs<TypeOrmModule>('supabase', () => ({
    key: process.env.SUPABASE_KEY,
    url: process.env.SUPABASE_URL,
}))