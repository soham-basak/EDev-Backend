import { MiddlewareHandler } from 'hono';
import { lucia } from '../auth';
import { Variables } from '../../types';
import { env } from '../lib/validations/env';
import { handleErrors } from '../utils';

export const sessionMiddleware: MiddlewareHandler<{
  Variables: Variables;
}> = async (c, next) => {
  try {
    const cookies = c.req.header('cookie');

    if (!cookies) {
      console.error('sessionMiddleware error: ', 'no cookie found');
      return c.json({
        errorMsg: 'no cookie found',
      });
    }

    const sessionId = lucia.readSessionCookie(cookies);

    if (!sessionId) {
      c.set('sessionId', null);
      c.set('userId', null);

      return next();
    }
    const { session, user } = await lucia.validateSession(sessionId);

    if (!session || !user) {
      console.error('sessionMiddleware info: ', 'no session or user found from cookies');
      return next();
    }

    c.set('sessionId', session.id);
    c.set('userId', user.id);

    return next();
  } catch (err) {
    console.error('sessionMiddleware error: ', err);

    return handleErrors(c, err);
  }
};

export const withAuthMiddleware: MiddlewareHandler<{
  Variables: Variables;
}> = async (c, next) => {
  const sessionId = c.get('sessionId');
  const userId = c.get('userId');

  if (!sessionId || !userId) {
    return c.json({
      errorMsg: 'no session found',
    });
  }

  return next();
};

export const withoutAuthMiddleware: MiddlewareHandler<{
  Variables: Variables;
}> = async (c, next) => {
  const sessionId = c.get('sessionId');
  const userId = c.get('userId');

  if (!sessionId || !userId) {
    return next();
  }

  return c.redirect(env.CLIENT_DOMAIN, 302);
};
