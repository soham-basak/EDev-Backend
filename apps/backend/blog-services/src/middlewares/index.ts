import { MiddlewareHandler } from "hono";

export const someMiddleware: MiddlewareHandler = async (_, next) => {
  console.log("middleware ran.");
  next();
};
