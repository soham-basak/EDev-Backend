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

export const createUser = async (userDetails: Omit<(typeof users)['$inferInsert'], 'id'>) => {
  const userId = nanoid(15);

  await db.insert(users).values({
    ...userDetails,
    id: userId,
  });

  return { userId };
};

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

export const createSession = async (c: Context, userId: string) => {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  setCookie(c, sessionCookie.name, sessionCookie.value, makeCookieOpts(sessionCookie.attributes));
};

export const createGitHubAuthorizationURL = async () => {
  const state = generateState();
  const url = await github.createAuthorizationURL(state);

  return { state, url };
};

export const createGoogleAuthorizationURL = async () => {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ['profile', 'email'],
  });

  return { state, url, codeVerifier };
};

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
