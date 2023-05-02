import { registerAs } from '@nestjs/config';

export default registerAs('supabase', () => ({
    key: process.env.SUPABASE_KEY,
    url: process.env.SUPABASE_URL,
}))