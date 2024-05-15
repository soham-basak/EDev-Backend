import { CookieOptions } from 'hono/utils/cookie';
import { env } from '../lib/validations/env';
import { makeDomain } from '../utils';

export default {
  port: env.PORT,
  cookieOpts: {
    path: '/',
    secure: env.NODE_ENV === 'PROD',
    sameSite: 'Strict',
    domain: makeDomain(),
    httpOnly: true,
    maxAge: 60 * 10,
  } satisfies CookieOptions,
};
