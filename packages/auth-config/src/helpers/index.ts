import { Context, Env, MiddlewareHandler, Next } from 'hono';
import axios, { AxiosError } from 'axios';

export type Variables = {
  user: User | null;
};

export type User = {
  id: string;
  username: string;
  email: string;
  image: string | null;
  authProvider: 'Google' | 'GitHub';
  createdAt: Date;
};

export const sessionMiddleware = async (c: any, next: Next) => {
  try {
    const { data, status } = await axios.get<User | null>(
      'http://localhost:3000/api/v1/auth/user',
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Cookie: c.req.header('cookie'),
        },
      }
    );

    if (status !== 200 || !data?.id) {
      c.set('user', null);
      return next();
    }

    c.set('user', data);

    return next();
  } catch (err) {
    if (!(err instanceof AxiosError)) {
      console.error('authSessionMiddleware error: ', err);
    }

    return next();
  }
};

export const withAuthMiddleware = async (c: any, next: Next) => {
  const user = c.get('user') as User | null;

  if (!user?.id) {
    return c.json(
      {
        errorMsg: 'no session found',
      },
      401
    );
  }

  return next();
};
