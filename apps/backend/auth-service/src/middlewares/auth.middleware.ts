import { MiddlewareHandler } from "hono";
import { lucia } from "../auth";

export const sessionMiddleware: MiddlewareHandler = async (c, next) => {
  const cookies = c.req.header("cookie");

  if (!cookies) {
    return c.json({
      errorMsg: "no cookie found",
    });
  }

  const sessionId = lucia.readSessionCookie(cookies);

  if (!sessionId) {
    c.set("session", null);
    c.set("user", null);
    return next();
  }
  const { session, user } = await lucia.validateSession(sessionId);
  c.set("sessionId", session?.id);
  c.set("userId", user?.id);
  return next();
};
