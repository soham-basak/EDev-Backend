import { Hono } from "hono";
import { cors } from "hono/cors";
import connectDB from "./config/db.config";
import routes from "./routes/routes";
import { logger } from "hono/logger";


const createServer = ()=>{
    const app = new Hono().basePath("/api/v1");
    app.use(logger());
    connectDB();
    app.use(
        '*',
        cors({
            origin: '*',
            allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true
        })
    );
    app.route("/blog", routes);
    return app;
}

export default createServer;