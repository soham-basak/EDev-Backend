import { HTTPException } from 'hono/http-exception';
import { StatusCode } from 'hono/utils/http-status';
import { MongooseError } from 'mongoose';
import { z } from 'zod';

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
      errorMsg: error.message,
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
