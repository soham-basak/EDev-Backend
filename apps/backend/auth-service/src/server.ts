import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { csrf } from 'hono/csrf';
import { cors } from 'hono/cors';
import { authRoutes } from './routes/auth.route';
import { sessionMiddleware } from './middlewares/auth.middleware';
import { globalEnv } from '@repo/util-config';
import { Variables } from '../types';
import { makeDomain } from './utils';

// createServer() creates the main server(entry point) config where
// all of the routes and middlewares are registered.
const createServer = () => {
  // creates a new instance of hono.
  // all routes are prefixed with '/api/v1'
  const app = new Hono<{ Variables: Variables }>().basePath('/api/v1');

  // Middlewares
  app.use('*', logger());
  app.use(
    '*',
    csrf({
      origin: makeDomain(),
    })
  );

  // CORS requests are only allowed for other services and client.
  app.use(
    '*',
    cors({
      origin: [globalEnv.CLIENT_DOMAIN],
      allowMethods: ['GET', 'POST'],
      credentials: true,
    })
  );

  // sessionMiddleware runs on every request.
  // Validates the user session by the sessionId
  // in cookies with DB and adds the user in context.
  app.use('*', sessionMiddleware);

  app.get('/healthcheck', (c) => {
    return c.text('OK', 200);
  });

  // Routes
  app.route('/auth', authRoutes);

  return app;
};

export default createServer;
