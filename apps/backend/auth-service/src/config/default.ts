import { CookieOptions } from "hono/utils/cookie";
import { env } from "../lib/validations/env";

export default {
  port: env.PORT,
  cookieOpts: {
    path: "/",
    secure: env.NODE_ENV === "PROD",
    sameSite: "Strict",
    httpOnly: true,
    maxAge: 60 * 10,
  } satisfies CookieOptions,
};
