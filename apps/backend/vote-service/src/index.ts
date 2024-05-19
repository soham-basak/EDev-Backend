import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { env } from './validations/env';
import connectDB from './config/db.config';
import router from './routes/vote.routes';
import auth, { Variables } from '@repo/auth-config';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';

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

const port = Number(env.PORT);
console.log(`vote-service is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
