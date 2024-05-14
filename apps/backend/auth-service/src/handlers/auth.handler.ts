import { Context, Handler } from "hono";
import {
  createGitHubAuthorizationURL,
  createGoogleAuthorizationURL,
  createSession,
  createUser,
  getUserByEmail,
  validateAndGetGithubUser,
  validateAndGetGoogleUser,
} from "../services/auth.service";
import { getCookie, setCookie } from "hono/cookie";

import config from "../config/default";
import { HTTPException } from "hono/http-exception";
import { handleErrors, makeCookieOpts } from "../utils";
import {
  CallbackValidator,
  githubUserValidationSchema,
  googleUserValidationSchema,
} from "../lib/validations/auth.validations";
import { env } from "../lib/validations/env";
import { lucia } from "../auth";

export const githubLoginHandler: Handler = async (c) => {
  try {
    const { state, url } = await createGitHubAuthorizationURL();

    if (!state || !url) {
      console.error(
        "githubLoginHandler error: ",
        "failed to create github auth url"
      );
      throw new HTTPException(400, {
        message: "failed to create github auth url",
      });
    }

    setCookie(c, "github_oauth_state", state, config.cookieOpts);

    return c.json({ url: url.toString() }, 201);
  } catch (err) {
    console.error("githubLoginHandler error: ", err);

    return handleErrors(c, err);
  }
};

export const googleLoginHandler: Handler = async (c) => {
  try {
    const { state, codeVerifier, url } = await createGoogleAuthorizationURL();

    if (!state || !codeVerifier || !url) {
      console.error(
        "goolgeLoginHandler error: ",
        "failed to create google auth url"
      );
      throw new HTTPException(400, {
        message: "failed to create google auth url",
      });
    }

    setCookie(c, "google_oauth_state", state, config.cookieOpts);
    setCookie(c, "google_oauth_verifier", codeVerifier, config.cookieOpts);

    return c.json({ url: url.toString() }, 201);
  } catch (err) {
    console.error("googleLoginHandler error: ", err);

    return handleErrors(c, err);
  }
};

export const githubCallbackHandler: Handler = async (
  c: Context<{}, "", CallbackValidator>
) => {
  try {
    const { code, state } = c.req.valid("query");

    const storedState = getCookie(c, "github_oauth_state") ?? null;
    const codeVerifier = getCookie(c, "github_oauth_verifier") ?? null;

    if (
      !code ||
      !state ||
      !storedState ||
      !codeVerifier ||
      state !== storedState
    ) {
      console.error("githubCallbackHandler error: ", "query or cookie invalid");
      throw new HTTPException(400, {
        message: "invalid cookie",
      });
    }

    const googleUser = await validateAndGetGoogleUser({ code, codeVerifier });
    const parsedUser = googleUserValidationSchema.parse(googleUser);
    const existingUser = await getUserByEmail(parsedUser.email);

    if (existingUser?.id) {
      await createSession(c, existingUser.id);
      return c.redirect(env.CLIENT_DOMAIN, 302);
    }

    const { userId } = await createUser({
      authProvider: "GitHub",
      email: parsedUser.email,
      username: parsedUser.name,
      image: parsedUser.picture,
      updatedAt: new Date(),
    });

    if (!userId) {
      throw new HTTPException(500, {
        message: "failed to create user",
      });
    }

    await createSession(c, userId);

    return c.redirect(env.CLIENT_DOMAIN, 302);
  } catch (err) {
    console.error("githubCallbackHandler error: ", err);

    return handleErrors(c, err);
  }
};

export const googleCallbackHandler: Handler = async (
  c: Context<{}, "", CallbackValidator>
) => {
  try {
    const { code, state } = c.req.valid("query");

    const storedState = getCookie(c, "google_oauth_state") ?? null;

    if (!code || !state || !storedState || state !== storedState) {
      console.error("googleCallbackHandler error: ", "query or cookie invalid");
      throw new HTTPException(400, {
        message: "invalid cookie",
      });
    }

    const githubUser = await validateAndGetGithubUser(code);
    const parsedUser = githubUserValidationSchema.parse(githubUser);
    const existingUser = await getUserByEmail(parsedUser.email);

    if (existingUser?.id) {
      await createSession(c, existingUser.id);
      return c.redirect(env.CLIENT_DOMAIN, 302);
    }

    const { userId } = await createUser({
      authProvider: "GitHub",
      email: parsedUser.email,
      username: parsedUser.login,
      image: parsedUser.avatar_url,
      updatedAt: new Date(),
    });

    if (!userId) {
      console.error("googleCallbackHandler error: ", "no user id");
      throw new HTTPException(500, {
        message: "failed to create user",
      });
    }

    await createSession(c, userId);

    return c.redirect(env.CLIENT_DOMAIN, 302);
  } catch (err) {
    console.error("googleCallbackHandler error: ", err);

    return handleErrors(c, err);
  }
};

export const logoutHandler: Handler = async (c) => {
  try {
    const session = c.get("session");

    if (!session?.id) {
      console.error("logout handler error: ", "no session in context");
      throw new HTTPException(400, {
        message: "invalid session",
      });
    }

    await lucia.invalidateSession(session.id);
    const sessionCookie = lucia.createBlankSessionCookie();

    setCookie(
      c,
      sessionCookie.name,
      sessionCookie.value,
      makeCookieOpts(sessionCookie.attributes)
    );
  } catch (err) {
    console.error("googleCallbackHandler error: ", err);

    return handleErrors(c, err);
  }
};
