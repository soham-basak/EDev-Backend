import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { env } from '../validations/env';

import * as schema from './schema';

// Creates a Pool of database connections.
const sql = new pg.Client({
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
  port: Number(env.POSTGRES_PORT),
  host: env.POSTGRES_HOST,
});

sql.connect().catch((err) => {
  throw new Error(`Database connection error: ${err}`);
});

// Instance of Drizzle which allows to interact
// with the database in a type-safe manner.
const db = drizzle(sql, { schema });

export { sql as connection, db };
