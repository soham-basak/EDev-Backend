import { NeonDbError } from '@neondatabase/serverless';
import { OAuth2RequestError } from 'arctic';
import { DrizzleError } from 'drizzle-orm';
import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { CookieOptions } from 'hono/utils/cookie';
import { Cookie } from 'lucia';
import { z } from 'zod';
import { env } from '../lib/validations/env';

export const handleErrors = (c: Context, error: unknown) => {
  if (error instanceof HTTPException) {
    return c.json(
      {
        errorMsg: error.message,
      },
      error.status
    );
  }
  if (error instanceof z.ZodError) {
    return c.json(
      {
        errorMsg: 'incorrect data passed',
      },
      422
    );
  }
  if (error instanceof DrizzleError) {
    return c.json(
      {
        errorMsg: 'something went wrong',
      },
      500
    );
  }
  if (error instanceof NeonDbError) {
    return c.json(
      {
        errorMsg: 'something went wrong',
      },
      500
    );
  }
  if (error instanceof OAuth2RequestError) {
    return c.json(error.message, 500);
  }
  if (error instanceof Error) {
    return c.json(
      {
        errorMsg: error.message,
      },
      error?.cause ?? 500
    );
  }
  return c.json(
    {
      errorMsg: 'something went wrong',
    },
    500
  );
};

export const makeCookieOpts = (opts: Cookie['attributes']): CookieOptions => {
  const sameSite: CookieOptions['sameSite'] =
    opts.sameSite === 'lax'
      ? 'Lax'
      : opts.sameSite === 'strict'
        ? 'Strict'
        : opts.sameSite === 'none'
          ? 'None'
          : 'Strict';

  return {
    ...opts,
    sameSite,
  };
};

export const makeDomain = () => {
  const DOMAIN = env.CLIENT_DOMAIN;

  if (env.NODE_ENV !== 'PROD') {
    return 'localhost';
  }

  return DOMAIN;
};
