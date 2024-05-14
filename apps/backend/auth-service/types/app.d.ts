/// <reference types="lucia" />

import { lucia } from "../src/auth/index.js";

declare namespace Lucia {
  type Auth = import("./lucia.js").Auth;
  type DatabaseUserAttributes = {};
  type DatabaseSessionAttributes = {};
}

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
  }
}
