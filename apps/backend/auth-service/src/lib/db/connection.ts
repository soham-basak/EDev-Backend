import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { env } from "../validations/env";

import * as schema from "./schema";

const poolConn = new Pool({
  connectionString: env.DB_URL,
});

export const db = drizzle(poolConn, { schema });
