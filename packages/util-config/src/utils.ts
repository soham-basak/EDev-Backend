import { HTTPException } from 'hono/http-exception';
import { StatusCode } from 'hono/utils/http-status';
import { z } from 'zod';
import { DrizzleError } from 'drizzle-orm';
import { MongooseError } from 'mongoose';

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
  if (error instanceof MongooseError) {
    return {
      status: 500,
      errorMsg: 'something went wrong',
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

export const handleErrors = (c: any, error: unknown) => {
  const { errorMsg, status } = returnError(error);
  return c.json({ errorMsg }, status);
};
