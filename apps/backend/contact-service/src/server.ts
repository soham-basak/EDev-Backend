import { Hono } from "hono";
import { cors } from "hono/cors";
import connectDB from "./config/db.config";
import router from "./routes/contact.route";
import { logger } from "hono/logger";


const createServer = () => {
    const app = new Hono().basePath("/api/v2"); //base path for all routes
    app.use("*", logger()); //"*" means all routes
    connectDB(); //connect to MongoDB
    app.use( //use middleware
        '*',
        cors({
            origin: '*',
            allowMethods: ['GET', 'POST', 'DELETE'], // Allow only GET, POST, DELETE methods
            credentials: true,
        })

    );

    app.route('/',router); // "/" means root route

    return app; //return the app
}

export default createServer;