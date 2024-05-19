import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({
  path: './.env',
});


export const env = z.object({
    MONGODB_URL: z.string().url(),
    NODE_ENV: z.enum(['DEV', 'PROD']),
    PORT: z.string(),
}).parse(process.env);
