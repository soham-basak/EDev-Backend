import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import authHeleprs, { Variables } from '@repo/auth-config';

const app = new Hono<{ Variables: Variables }>();

app.use('*', authHeleprs.authSessionMiddleware);

app.get('/', (c) => {
  const user = c.get('user');

  return c.json(user);
});

const port = 5000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
