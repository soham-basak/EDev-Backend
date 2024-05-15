import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

import { env } from '../validations/env';

const sql = new pg.Pool({ connectionString: env.DB_URL });

await sql.connect();

export const db = drizzle(sql);
