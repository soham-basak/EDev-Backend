import { Hono } from "hono";
import { cors } from "hono/cors";
import connectDB from "./config/db.config";
import routes from "./routes/routes";


const createServer = ()=>{
    const app = new Hono().basePath("/api/v1");
    connectDB();
    app.use(
        '*',
        cors({
            origin: '*',
            allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true
        })
    );
    app.route("/", routes);
    return app;
}

export default createServer;