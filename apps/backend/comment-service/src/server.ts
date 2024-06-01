import { Hono } from 'hono';
import connectDB from './config/db.config';
import router from './routes/comment.route';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import auth, { Variables } from '@repo/auth-config';
import { globalEnv } from '@repo/util-config';

const createServer = () => {
  const app = new Hono<{ Variables: Variables }>().basePath('/api/v1');

  // Connecting to DB
  connectDB();

  // Middlewares
  app.use('*', logger());

  app.use(
    '*',
    cors({
      origin: [globalEnv.CLIENT_DOMAIN],
      allowMethods: ['GET', 'POST', 'DELETE'],
      credentials: true,
    })
  );

  // If this shows a type error for context
  // make sure to keep the same Hono version
  // as the packages.
  app.use('*', auth.sessionMiddleware);

  app.get('/healthcheck', (c) => {
    return c.text('OK', 200);
  });

  // Routes
  app.route('/', router);

  return app;
};

export default createServer;
