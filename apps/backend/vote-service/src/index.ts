import { serve } from '@hono/node-server';
import { env } from './validations/env';
import createServer from './server';

async function server() {
  const server = createServer();
  const PORT = Number(env.PORT);

  try {
    serve({
      fetch: server.fetch,
      port: PORT,
    });

    console.log('vote service started at port:', PORT);
  } catch (err) {
    console.error('vote service shutting down', err);
    process.exit(1);
  }
}

server();
