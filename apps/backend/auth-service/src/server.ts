import { Hono } from 'hono';
import dotenv from 'dotenv';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { authRoutes } from './routes/auth.routes';
import { sessionMiddleware } from './middlewares/auth.middleware';
import { Variables } from '../types';
import { googleLoginHandler } from './handlers/auth.handler';

dotenv.config({
  path: './.env',
});

const createServer = () => {
  const app = new Hono<{ Variables: Variables }>().basePath('/api/v1');

  app.use('*', logger());
  app.use(
    '*',
    cors({
      origin: ['http://localhost:5173'],
      allowMethods: ['GET', 'POST'],
    })
  );

  app.get('/healthcheck', (c) => {
    return c.text('OK', 200);
  });

  app.use('*', sessionMiddleware);

  app.route('/auth', authRoutes);

  return app;
};

export default createServer;
