import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import connectDB from './config/db.config';
import router from './routes/comment.route';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { cors } from 'hono/cors';


connectDB();
const app = new Hono().basePath('/api/v1');


app.use('*', logger(), prettyJSON())
app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
)


app.route('/', router)

const port = 8787;


serve({
  fetch: app.fetch,
  port,
});

console.log(`Server is running on port ${port}`);
