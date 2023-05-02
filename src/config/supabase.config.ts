import { registerAs } from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm'

export default registerAs('supabase', () => ({
    key: process.env.SUPABASE_KEY,
    url: process.env.SUPABASE_URL,
}))