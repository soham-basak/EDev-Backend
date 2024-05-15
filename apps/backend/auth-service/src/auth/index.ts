import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { Lucia, TimeSpan } from 'lucia';
import { GitHub, Google } from 'arctic';
import { env } from '../lib/validations/env';
import { db } from '../lib/db/connection';
import { sessions, users } from '../lib/db/schema';
import config from '../config/default';

export const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(4, 'w'),
  sessionCookie: {
    attributes: {
      secure: config.cookieOpts.secure,
      domain: config.cookieOpts.domain,
      path: config.cookieOpts.path,
      sameSite: 'strict',
    },
    expires: true,
  },
});

export const github = new GitHub(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET);

export const google = new Google(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  `http://localhost:${config.port}/api/v1/auth/login/callback/google`
);
