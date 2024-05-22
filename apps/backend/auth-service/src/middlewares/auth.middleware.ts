import { MiddlewareHandler } from 'hono';
import { lucia } from '../auth';
import { Variables } from '../../types';
import { globalEnv } from '@repo/util-config';
import { handleErrors } from '../utils';

// sessionMiddleware() gets the cookies from the header.
// Validates the session cookie and sets the sessionId
// and userId in Context.
export const sessionMiddleware: MiddlewareHandler<{
  Variables: Variables;
}> = async (c, next) => {
  try {
    const cookies = c.req.header('cookie');

    if (!cookies) {
      return next();
    }

    // Lucia reads the session cookie.
    const sessionId = lucia.readSessionCookie(cookies);

    if (!sessionId) {
      c.set('sessionId', null);
      c.set('userId', null);

      return next();
    }

    // Validates the session in cookie with the session in DB
    const { session, user } = await lucia.validateSession(sessionId);

    if (!session || !user || session.userId !== user.id) {
      return next();
    }

    c.set('sessionId', session.id);
    c.set('userId', user.id);
    console.log('session with userId:', user.id);

    return next();
  } catch (err) {
    console.error('sessionMiddleware error: ', err);

    return next();
  }
};

// withAuthMiddleware() checks if there is already session
// and userId present in Context.
// If not it blocks the request else forwards
// to the next handler.
export const withAuthMiddleware: MiddlewareHandler<{
  Variables: Variables;
}> = async (c, next) => {
  const sessionId = c.get('sessionId');
  const userId = c.get('userId');

  if (!sessionId || !userId) {
    return c.json(
      {
        errorMsg: 'no session found',
      },
      401
    );
  }

  return next();
};

// withoutAuthMiddleware() checks if there is already session
// and userId present in Context.
// If not it forwards the reqeust to the next handler
// else redirects to the client domain.
export const withoutAuthMiddleware: MiddlewareHandler<{
  Variables: Variables;
}> = async (c, next) => {
  const sessionId = c.get('sessionId');
  const userId = c.get('userId');

  if (!sessionId || !userId) {
    return next();
  }

  return c.json({ errorMsg: 'already logged in.' }, 401);
};
