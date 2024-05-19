import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { Lucia, TimeSpan } from 'lucia';
import { GitHub, Google } from 'arctic';
import { env } from '../lib/validations/env';
import { db } from '../lib/db/connection';
import { sessions, users } from '../lib/db/schema';
import config from '../config/default';
import { globalEnv } from '@repo/util-config';

// Creates a new instance of the Drizzle Adapter by Lucia Auth.
// Takes the instance of DB adapter by drizzle, sessions
// and users table as parameters.
export const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

// Creates a new instance of Lucia with the adpater from above.
export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(4, 'w'), // Expires in 4 weeks.
  sessionCookie: {
    attributes: {
      secure: config.cookieOpts.secure,
      domain: config.cookieOpts.domain,
      path: config.cookieOpts.path,
      sameSite: 'strict', // Strict is used for only the session cookie policy.
    },
    expires: true,
  },
});

// New instance of GitHub Provider for OAuth2 by Arctic
export const github = new GitHub(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET);

// New instance of Google Provider for OAuth2 by Arctic
export const google = new Google(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  `${globalEnv.AUTH_SERVICE_URL}/api/v1/auth/login/callback/google`
);
