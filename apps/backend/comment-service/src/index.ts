import { Hono } from 'hono';
import connectDB from './config/db.config';
import router from './routes/comment.route';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import auth, { Variables } from '@repo/auth-config';

const createServer = () => {
  connectDB();
  const app = new Hono<{ Variables: Variables }>().basePath('/api/v1');

  app.use('*', logger());

  app.use(
    '*',
    cors({
      origin: '*',
      allowMethods: ['GET', 'POST', 'DELETE'],
    })
  );

  app.use('*', auth.sessionMiddleware);

  app.get('/comment-service', (c) => {
    return c.text('OK', 200);
  });

  app.route('/', router);

  return app;
};

export default createServer;
