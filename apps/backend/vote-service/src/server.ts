import { Hono } from 'hono';
import connectDB from './config/db.config';
import router from './routes/vote.routes';
import auth, { Variables } from '@repo/auth-config';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { globalEnv } from '@repo/util-config';

const createServer = () => {
  const app = new Hono<{ Variables: Variables }>().basePath('/api/v1');
  connectDB();

  app.use('*', logger());

  // middlewares
  app.use(
    '*',
    cors({
      origin: [globalEnv.CLIENT_DOMAIN],
      allowMethods: ['GET', 'POST', 'DELETE'],
      credentials: true,
    })
  );

  app.use('*', auth.sessionMiddleware);

  // routes
  app.route('/', router);

  return app;
};

export default createServer;
