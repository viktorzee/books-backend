import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });
config({ path: '.env' });

const getDataSourceOptions = (): DataSourceOptions => {
  const baseOptions = {
    type: 'postgres' as const,
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/migrations/*.js'],
    synchronize: false,
  };

  // Use individual params if available
  if (process.env.DB_HOST) {
    return {
      ...baseOptions,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    };
  }

  // Fallback to URL
  return {
    ...baseOptions,
    url: process.env.DB_URL || process.env.DATABASE_URL,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  };
};

export const dataSourceOptions = getDataSourceOptions();

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
