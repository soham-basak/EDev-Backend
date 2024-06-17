import { serve } from '@hono/node-server';
import createServer from './server';
import config from './config/default';
import { migrateSchema } from './lib/db/migrate';

async function main() {
  // migrate on start up.
  // will throw error if fails.
  if (process.argv.includes('--migrate')) {
    await migrateSchema();
  }

  // Creates an instance of the main server.
  // Returns an the instance of the hono server.
  const server = await createServer();

  const PORT = Number(config.port);

  try {
    serve({
      fetch: server.fetch,
      port: PORT,
    });

    console.log('auth service started at port:', PORT);
  } catch (err) {
    console.error('auth service shutting down', err);
    process.exit(1);
  }
}

main();
