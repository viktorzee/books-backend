import { registerAs } from '@nestjs/config';
import {TypeOrmModuleOptions} from '@nestjs/typeorm'

export default registerAs<TypeOrmModuleOptions>('database', () => ({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port:  Number(process.env.DB_PORT),
}))