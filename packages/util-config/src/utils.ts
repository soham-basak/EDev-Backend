import { HTTPException } from 'hono/http-exception';
import { StatusCode } from 'hono/utils/http-status';
import { z } from 'zod';
import { DrizzleError } from 'drizzle-orm';

type HandleError = {
  status: StatusCode;
  errorMsg: string;
};

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
  return {
    status: 500,
    errorMsg: 'something went wrong',
  };
};
