import { Hono } from "hono";
import { createUserHandler } from "../handler/user.handler";
import { authorize } from "../middleware/auth.middleware";

const routes = new Hono();

routes.post("/user", authorize, createUserHandler);

export default routes;
