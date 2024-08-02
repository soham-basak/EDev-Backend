import { Hono } from "hono";
import { createPostHandler, readPostHandler,readAllPostHandler, updatePostHandler,deletePostHandler } from "../handlers";
import { authorize } from "../middlewares/auth.middleware";
import { read } from "fs";

const routes = new Hono();

routes.post("/create", authorize,createPostHandler);
routes.get("/:id",authorize ,readPostHandler);
routes.get("/",authorize,readAllPostHandler);
routes.put("/:id",authorize,updatePostHandler);
routes.delete("/:id",authorize,deletePostHandler);

export default routes;
