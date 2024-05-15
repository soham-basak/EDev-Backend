import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { authRoutes } from './routes/auth.routes';
import { sessionMiddleware } from './middlewares/auth.middleware';
import { Variables } from '../types';

const createServer = () => {
  const app = new Hono<{ Variables: Variables }>().basePath('/api/v1');

  app.use('*', logger());
  app.use(
    '*',
    cors({
      origin: ['http://localhost:5173', 'http://localhost:5000'],
      allowMethods: ['GET', 'POST'],
    })
  );

  app.use('*', sessionMiddleware);

  app.get('/healthcheck', (c) => {
    return c.text('OK', 200);
  });

  app.route('/auth', authRoutes);

  return app;
};

export default createServer;
