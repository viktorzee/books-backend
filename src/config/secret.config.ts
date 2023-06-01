import { registerAs } from '@nestjs/config';

export default registerAs('secret', () => ({
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY as string,   
}))