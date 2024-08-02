import { Hono } from "hono";
import { cors } from "hono/cors";
import connectDB from "./config/db.config";
import router from "./routes/email.route";
import { logger } from "hono/logger";



const createEmailServer = () => {
    const app = new Hono().basePath("/api/v2");
    app.use("*", logger());
    connectDB();
    app.use(
        '*',
        cors({
            origin: '*',
            allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true,
        })
    );

    app.route('/',router);

    return app;
}

export default createEmailServer;