import { registerAs } from '@nestjs/config';
import {TypeOrmModuleOptions} from '@nestjs/typeorm'

export default registerAs<TypeOrmModuleOptions>('database', () => ({
    // host: process.env.DB_HOST,
    // username: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_NAME,
    url: process.env.DB_URL,
    type: 'postgres', // prefer to add this to the env too
    port:  Number(process.env.DB_PORT),
}))