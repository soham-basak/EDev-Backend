import { generateCodeVerifier, generateState } from 'arctic';
import { github, google, lucia } from '../auth';
import { GitHubUser, GoogleUser } from '../../types';
import { db } from '../lib/db/connection';
import { users } from '../lib/db/schema';
import { eq } from 'drizzle-orm';
import { setCookie } from 'hono/cookie';
import { Context } from 'hono';
import { makeCookieOpts } from '../utils';
import { nanoid } from 'nanoid';

// getUserByEmail() takes an email as parameter.
// Returns an user from DB if found else null.
export const getUserByEmail = async (email: string) => {
  const [user] = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      image: users.image,
      authProvider: users.authProvider,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.email, email));

  if (!user) {
    return null;
  }

  return user;
};

// getUserById() takes an userId as parameter.
// Returns an user from DB if found else null.
export const getUserById = async (userId: string) => {
  const [user] = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      image: users.image,
      authProvider: users.authProvider,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, userId));

  if (!user) {
    return null;
  }

  return user;
};

// createUser() takes userDetails of type user without
// the id property as parameter.
// Creates a random id and associates it with the userDetails.
// Inserts the user to the DB.
// Returns the generated userId.
export const createUser = async (userDetails: Omit<(typeof users)['$inferInsert'], 'id'>) => {
  const userId = nanoid(15);

  await db.insert(users).values({
    ...userDetails,
    id: userId,
  });

  return { userId };
};

// validateAndGetGithubUser() takes a code as parameter.
// Generates a token by which the user GitHub info can
// be accessed for one time use only.
// Fetches the user details via GitHub API and returns the user.
export const validateAndGetGithubUser = async (code: string) => {
  const tokens = await github.validateAuthorizationCode(code);
  const githubUserRes = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`,
    },
  });
  const githubUser: GitHubUser = await githubUserRes.json();

  return githubUser;
};

// createSession() takes c of type Context and userId
// of type string as parameters.
// Creates a session and sets session cookie by userId
export const createSession = async (c: Context, userId: string) => {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  setCookie(c, sessionCookie.name, sessionCookie.value, makeCookieOpts(sessionCookie.attributes));
};

// createGitHubAuthorizationURL() creates a state and
// GitHub authorization URL where the user will be forwared
// to for logging in using GitHub account.
export const createGitHubAuthorizationURL = async () => {
  const state = generateState();
  const url = await github.createAuthorizationURL(state);

  return { state, url };
};

// createGitHubAuthorizationURL() creates a state and code verifier.
// Generates an URL using the state and code verifier where
// The URL will forward the user to Google's login page.
export const createGoogleAuthorizationURL = async () => {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ['profile', 'email'],
  });

  return { state, url, codeVerifier };
};

// validateAndGetGoogleUser() takes code and codeVerifer of type string.
// Generates a token by which the user info can be accessed
// for one time use only
// Returns the user.
export const validateAndGetGoogleUser = async ({
  code,
  codeVerifier,
}: {
  code: string;
  codeVerifier: string;
}) => {
  const tokens = await google.validateAuthorizationCode(code, codeVerifier);
  const googleUserRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`,
    },
  });
  const googleUser: GoogleUser = await googleUserRes.json();

  return googleUser;
};
