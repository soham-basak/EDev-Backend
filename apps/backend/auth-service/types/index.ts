import { CookieOptions } from 'hono/utils/cookie';

export type GitHubUser = {
  login: string;
  email: string;
  avatar_url: string;
};

export type GoogleUser = {
  name: string;
  email: string;
  picture: string;
};

export type AuthProviders = ['Google', 'GitHub'];

export type ConfigOpts = {
  port: string;
  cookieOpts: CookieOptions;
};

export type Variables = {
  sessionId: string | null;
  userId: string | null;
};
