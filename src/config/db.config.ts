import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs<TypeOrmModuleOptions>('database', () => {
  const sslConfig = process.env.DB_SSL !== 'false' ? { rejectUnauthorized: false } : false;

  // Use individual params if available, otherwise fall back to URL
  if (process.env.DB_HOST) {
    return {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: sslConfig,
      extra: {
        // Force IPv4
        family: 4,
      },
    };
  }

  // Fallback to URL
  const dbUrl = process.env.DB_URL || process.env.DATABASE_URL;
  return {
    type: 'postgres',
    url: dbUrl,
    ssl: sslConfig,
    extra: {
      // Force IPv4
      family: 4,
    },
  };
});