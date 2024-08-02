import dotenv from 'dotenv';
import { z } from 'zod';


dotenv.config({
  path: './.env',
});

export const env = z.object({
    PORT: z.string(),
    MONGO_URL: z.string(),
    TOKEN_SECRET: z.string()
}).parse(process.env);