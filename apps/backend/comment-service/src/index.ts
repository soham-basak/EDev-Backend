import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import connectDB from './config/db.config';
import router from './routes/comment.route';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import auth, { Variables } from '@repo/auth-config';

const app = new Hono<{ Variables: Variables }>().basePath('/api/v1');
connectDB();

app.use('*', logger());

app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'DELETE'],
  })
);

app.use('*', auth.sessionMiddleware);

app.route('/', router);

const port = 8787;

serve({
  fetch: app.fetch,
  port,
});

console.log(`Server is running on port ${port}`);
