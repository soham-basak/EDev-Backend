import { Context, Handler } from 'hono';
import {
  createGitHubAuthorizationURL,
  createGoogleAuthorizationURL,
  createSession,
  createUser,
  getUserByEmail,
  getUserById,
  validateAndGetGithubUser,
  validateAndGetGoogleUser,
} from '../services/auth.service';
import { getCookie, setCookie } from 'hono/cookie';

import config from '../config/default';
import { HTTPException } from 'hono/http-exception';
import { handleErrors, redirectToAuthError, makeCookieOpts } from '../utils';
import {
  CallbackValidator,
  githubUserValidationSchema,
  googleUserValidationSchema,
} from '../lib/validations/auth.validations';
import { globalEnv } from '@repo/util-config';
import { lucia } from '../auth';
import { Variables } from '../../types';

// GitHub Login Handler
// POST request
// Returns an URL which forwards the user to GitHub
// login page.
export const githubLoginHandler: Handler = async (c) => {
  try {
    const { state, url } = await createGitHubAuthorizationURL();

    if (!state || !url) {
      console.error('githubLoginHandler error: ', 'failed to create github auth url');
      throw new HTTPException(400, {
        message: 'failed to create github auth url',
      });
    }

    setCookie(c, 'github_oauth_state', state, config.cookieOpts);

    return c.json({ url: url.toString() }, 201);
  } catch (err) {
    console.error('githubLoginHandler error: ', err);

    return handleErrors(c, err);
  }
};

// Goolge Login Handler
// POST request
// Returns an URL which forwards the user to Google
// login page.
export const googleLoginHandler: Handler = async (c) => {
  try {
    const { state, codeVerifier, url } = await createGoogleAuthorizationURL();

    if (!state || !codeVerifier || !url) {
      console.error('goolgeLoginHandler error: ', 'failed to create google auth url');
      throw new HTTPException(500, {
        message: 'failed to create google auth url',
      });
    }

    setCookie(c, 'google_oauth_state', state, config.cookieOpts);
    setCookie(c, 'google_oauth_verifier', codeVerifier, config.cookieOpts);

    return c.json({ url: url.toString() }, 201);
  } catch (err) {
    console.error('googleLoginHandler error: ', err);

    return handleErrors(c, err);
  }
};

// GitHub Callback Handler
// GET request
// Creates user session if user already exists else
// creates an user and the session.
// Redirects the user to the client domain.
export const githubCallbackHandler: Handler = async (c: Context<{}, '', CallbackValidator>) => {
  try {
    const { code, state } = c.req.valid('query');

    const storedState = getCookie(c, 'github_oauth_state') ?? null;

    if (!code || !state || !storedState || state !== storedState) {
      console.error('githubCallbackHandler error: ', 'query or cookie invalid');
      throw new HTTPException(400, {
        message: 'invalid cookie',
      });
    }

    const githubUser = await validateAndGetGithubUser(code);
    const parsedUser = githubUserValidationSchema.parse(githubUser);
    const existingUser = await getUserByEmail(parsedUser.email);

    if (existingUser?.id) {
      await createSession(c, existingUser.id);
      return c.redirect(globalEnv.CLIENT_DOMAIN, 302);
    }

    const { userId } = await createUser({
      authProvider: 'GitHub',
      email: parsedUser.email,
      username: parsedUser.login,
      image: parsedUser.avatar_url,
      updatedAt: new Date(),
    });

    if (!userId) {
      console.error('githubCallbackHandler error: ', 'no userId created by createUser function');
      throw new HTTPException(500, {
        message: 'failed to create user',
      });
    }

    await createSession(c, userId);

    return c.redirect(globalEnv.CLIENT_DOMAIN, 302);
  } catch (err) {
    console.error('githubCallbackHandler error: ', err);

    return redirectToAuthError(c, err);
  }
};

// Goolge Callback Handler
// GET request
// Creates user session if user already exists else
// creates an user and the session.
// Redirects the user to the client domain.
export const googleCallbackHandler: Handler = async (c: Context<{}, '', CallbackValidator>) => {
  try {
    const { code, state } = c.req.valid('query');

    const storedState = getCookie(c, 'google_oauth_state') ?? null;
    const codeVerifier = getCookie(c, 'google_oauth_verifier') ?? null;

    if (!code || !state || !storedState || !codeVerifier || state !== storedState) {
      console.error('googleCallbackHandler error: ', 'query or cookie invalid');
      throw new HTTPException(400, {
        message: 'invalid cookie',
      });
    }

    const googleUser = await validateAndGetGoogleUser({ code, codeVerifier });
    const parsedUser = googleUserValidationSchema.parse(googleUser);
    const existingUser = await getUserByEmail(parsedUser.email);

    if (existingUser?.id) {
      await createSession(c, existingUser.id);
      return c.redirect(globalEnv.CLIENT_DOMAIN, 302);
    }

    const { userId } = await createUser({
      authProvider: 'Google',
      email: parsedUser.email,
      username: parsedUser.name,
      image: parsedUser.picture,
      updatedAt: new Date(),
    });

    if (!userId) {
      console.error('googleCallbackHandler error: ', 'no userid created by createUser function');
      throw new HTTPException(500, {
        message: 'failed to create user',
      });
    }

    await createSession(c, userId);

    return c.redirect(globalEnv.CLIENT_DOMAIN, 302);
  } catch (err) {
    console.error('googleCallbackHandler error: ', err);

    return redirectToAuthError(c, err);
  }
};

// Logout Handler
// POST request
// Deletes the current session cookie.
export const logoutHandler: Handler<{ Variables: Variables }> = async (c) => {
  try {
    const sessionId = c.get('sessionId');

    if (!sessionId) {
      console.error('logout handler error: ', 'no session in context');
      throw new HTTPException(400, {
        message: 'invalid session',
      });
    }

    await lucia.invalidateSession(sessionId);
    const sessionCookie = lucia.createBlankSessionCookie();

    setCookie(c, sessionCookie.name, sessionCookie.value, makeCookieOpts(sessionCookie.attributes));

    return c.json({}, 200);
  } catch (err) {
    console.error('googleCallbackHandler error: ', err);

    return handleErrors(c, err);
  }
};

// Get User Handler
// GET request
// Gets the session from the DB by using the userId in Context.
// Returns the user.
export const getUserSessionHandler: Handler<{ Variables: Variables }> = async (c) => {
  try {
    const userId = c.get('userId');

    if (!userId) {
      console.error('getUserSessionHandler error: ', 'no user id found in context');
      throw new HTTPException(401, {
        message: 'no user id found in context',
      });
    }

    const dbUser = await getUserById(userId);

    if (!dbUser) {
      console.error('getUserSessionHandler error: ', 'no user found by this id');
      throw new HTTPException(401, {
        message: 'no user found by this id',
      });
    }

    return c.json(dbUser, 200);
  } catch (err) {
    console.error('getUserSessionHandler error: ', err);

    return handleErrors(c, err);
  }
};
