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

// Login Routes for GitHub and Google Provider.
// POST Request
// Access - Public only (redirects if already logged in)
authRoutes.post('/login/github', withoutAuthMiddleware, githubLoginHandler);
authRoutes.post('/login/google', withoutAuthMiddleware, googleLoginHandler);

// Login Callback Routes for GitHub and Google Provider.
// GET Request
// Access - Public only (redirects if already logged in)
// Validation - Query Params
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

// User Route for getting current session.
// GET Request
// Access - Private only
authRoutes.get('/user', withAuthMiddleware, getUserSessionHandler);

// Logout Route for deleting current session.
// POST Request
// Access - Private only
authRoutes.post('/logout', withAuthMiddleware, logoutHandler);
