import { defineConfig } from 'drizzle-kit';
import { env } from './src/lib/validations/env';

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DB_URL,
  },
  verbose: true,
  strict: true,
  breakpoints: true,
});
