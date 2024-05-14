import { Hono } from "hono";
import dotenv from "dotenv";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { authRoutes } from "./routes/auth.routes";
import { sessionMiddleware } from "./middlewares/auth.middleware";
import { Variables } from "../types";

dotenv.config({
  path: "./.env",
});

const createServer = () => {
  const app = new Hono<{ Variables: Variables }>().basePath("/api/v1");

  app.use("*", logger());
  app.use(
    "*",
    cors({
      origin: ["http://localhost:5173"],
      allowMethods: ["GET", "POST"],
    })
  );

  app.route("/auth", authRoutes);

  app.use("*", sessionMiddleware);

  // app.get("/cookies", async (c) => {
  //   const user = c.get("user");
  //   const dbUser = await db
  //     .select()
  //     .from(userTable)
  //     .where(eq(userTable.id, user.id));
  //   return c.json(dbUser);
  // });

  return app;
};

export default createServer;
