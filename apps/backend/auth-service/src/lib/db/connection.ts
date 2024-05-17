import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { env } from '../validations/env';

import * as schema from './schema';

// Creates a Pool of database connections.
const sql = new pg.Pool({ connectionString: env.DB_URL });

await sql.connect();

// Instance of Drizzle which allows to interact
// with the database in a type-safe manner.
export const db = drizzle(sql, { schema });
