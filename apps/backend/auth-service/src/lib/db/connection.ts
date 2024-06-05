import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { env } from '../validations/env';

import * as schema from './schema';

// Creates a Pool of database connections.
const sql = new pg.Pool({
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
  port: 5432,
  host: env.POSTGRES_HOST ?? 'localhost',
});

sql.connect().catch((err) => {
  console.error('db connection error: ', err);
});

// Instance of Drizzle which allows to interact
// with the database in a type-safe manner.
export const db = drizzle(sql, { schema });
