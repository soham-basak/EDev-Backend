import { z } from 'zod';

import dotenv from 'dotenv';

dotenv.config({
  path: '../../../.env',
});

export const globalEnv = z
  .object(
    {
      AUTH_SERVICE_URL: z.string().url(),
      COMMENT_SERVICE_URL: z.string().url(),
      CLIENT_DOMAIN: z.string().url(),
    },
    { message: 'global env error' }
  )
  .parse(process.env);
