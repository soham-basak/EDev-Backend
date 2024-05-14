import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { sessionTable, userTable } from "../db/schema";
import { db } from "../db/connection";
import { Lucia } from "lucia";
import { GitHub, Google } from "arctic";

export const adapter = new DrizzlePostgreSQLAdapter(
  db,
  sessionTable,
  userTable
);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});

export const github = new GitHub(
  process.env.GITHUB_CLIENT_ID!,
  process.env.GITHUB_CLIENT_SECRET!
);

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  "http://localhost:3000/api/login/callback/google"
);
