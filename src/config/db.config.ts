import { registerAs } from '@nestjs/config';
import {TypeOrmModuleOptions} from '@nestjs/typeorm'

export default registerAs<TypeOrmModuleOptions>('database', () => ({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    type: 'mysql', // prefer to add this to the env too
    port:  Number(process.env.DB_PORT),
}))