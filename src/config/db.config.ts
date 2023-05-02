import { registerAs } from '@nestjs/config';
import {TypeOrmModuleOptions} from '@nestjs/typeorm'

export default registerAs<TypeOrmModuleOptions>('database', () => ({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port:  parseInt(process.env.DATABASE_PORT || '5432', 10),
}))