import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({
  path: './.env',
});

export const env = z

  .object({
    DB_URL: z.string().url(),
    GITHUB_CLIENT_ID: z.string().min(2),
    GITHUB_CLIENT_SECRET: z.string().min(2),
    GOOGLE_CLIENT_ID: z.string().min(2),
    GOOGLE_CLIENT_SECRET: z.string().min(2),
    NODE_ENV: z.enum(['DEV', 'PROD']),
    PORT: z.string(),
    CLIENT_DOMAIN: z.string().url(),
  })
  .parse(process.env);
