import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { env } from '../validations/env';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

const pool = new Pool({ connectionString: env.DB_URL });
neonConfig.webSocketConstructor = ws;

export const db = drizzle(pool);
