import { registerAs } from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm'

export default registerAs<TypeOrmModule>('database', () => ({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
}))