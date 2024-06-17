import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { connection, db } from './connection';

export const migrateSchema = async () => {
  try {
    console.log('migrating schema...');

    await migrate(db, { migrationsFolder: './migrations' });
    console.log('migration complete');

    await connection.end();
    console.log('connection closed');
  } catch (err) {
    console.error(`db migration failed: ${err}`);

    throw new Error(`db migration failed: ${err}`);
  }
};
