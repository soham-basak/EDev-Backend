import { Hono } from 'hono';
import {
  githubCallbackHandler,
  githubLoginHandler,
  googleCallbackHandler,
  googleLoginHandler,
  logoutHandler,
  getUserSessionHandler,
} from '../handlers/auth.handler';
import { callbackValidator } from '../lib/validations/auth.validations';
import { withAuthMiddleware, withoutAuthMiddleware } from '../middlewares/auth.middleware';

export const authRoutes = new Hono();

authRoutes.post('/login/github', withoutAuthMiddleware, githubLoginHandler);
authRoutes.post('/login/google', withoutAuthMiddleware, googleLoginHandler);

authRoutes.get(
  '/login/callback/github',
  withoutAuthMiddleware,
  callbackValidator,
  githubCallbackHandler
);
authRoutes.get(
  '/login/callback/google',
  withoutAuthMiddleware,
  callbackValidator,
  googleCallbackHandler
);

authRoutes.get('/user', withAuthMiddleware, getUserSessionHandler);

authRoutes.post('/logout', withAuthMiddleware, logoutHandler);
