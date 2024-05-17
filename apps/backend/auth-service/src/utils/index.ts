import { NeonDbError, DatabaseError } from '@neondatabase/serverless';
import { OAuth2RequestError } from 'arctic';
import { DrizzleError } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import { CookieOptions } from 'hono/utils/cookie';
import { Cookie } from 'lucia';
import { z } from 'zod';
import { globalEnv } from '@repo/util-config';
import { StatusCode } from 'hono/utils/http-status';
import { Context } from 'hono';
import { env } from '../lib/validations/env';

type HandleError = {
  status: StatusCode;
  errorMsg: string;
};

// returnError() takes error of type unknown as a paramter.
// Returns an error message.
export const returnError = (error: unknown): HandleError => {
  if (error instanceof HTTPException) {
    return {
      errorMsg: error.message,
      status: error.status,
    };
  }
  if (error instanceof z.ZodError) {
    return {
      status: 422,
      errorMsg: 'incorrect data passed',
    };
  }
  if (error instanceof DrizzleError) {
    return {
      status: 500,
      errorMsg: 'something went wrong',
    };
  }
  if (error instanceof NeonDbError) {
    return {
      status: 500,
      errorMsg: 'something went wrong',
    };
  }
  if (error instanceof DatabaseError) {
    return {
      status: 500,
      errorMsg: 'something went wrong',
    };
  }
  if (error instanceof OAuth2RequestError) {
    return { status: 500, errorMsg: 'oauth2 error' };
  }
  return {
    status: 500,
    errorMsg: 'something went wrong',
  };
};

// handleErrors() takes c of type Context by Hono and
// error as type unknown as parameters.
// Returns an appropriate error message to the client
// as response.
export const handleErrors = (c: Context, error: unknown) => {
  const { errorMsg, status } = returnError(error);
  return c.json(errorMsg, status);
};

// handleErrors() takes c of type Context by Hono and
// error as type unknown as parameters.
// Redirects the user to an auth error page with status
// and an error message as query params.
export const redirectToAuthError = (c: Context, error: unknown) => {
  const { errorMsg, status } = returnError(error);
  return c.redirect(`${globalEnv.CLIENT_DOMAIN}/auth/error?error=${errorMsg}&status=${status}`);
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
  const DOMAIN = globalEnv.CLIENT_DOMAIN;

  if (env.NODE_ENV !== 'PROD') {
    return 'localhost';
  }

  return DOMAIN;
};
