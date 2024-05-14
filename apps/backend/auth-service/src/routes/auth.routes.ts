import { Hono } from "hono";
import {
  githubCallbackHandler,
  githubLoginHandler,
  googleCallbackHandler,
  googleLoginHandler,
  logoutHandler,
} from "../handlers/auth.handler";
import { callbackValidator } from "../lib/validations/auth.validations";

export const authRoutes = new Hono();

authRoutes.post("/login/github", githubLoginHandler);
authRoutes.post("/login/google", googleLoginHandler);

authRoutes.post(
  "/login/callback/github",
  callbackValidator,
  githubCallbackHandler
);
authRoutes.post(
  "/login/callback/google",
  callbackValidator,
  googleCallbackHandler
);

authRoutes.post("/logout", logoutHandler);

authRoutes.get("/user");
