import { serve } from "@hono/node-server";
import createServer from "./index";
import { env } from "./validations/env";

async function server() {
    const server = createServer();
    const PORT = Number(env.PORT || 8787);

    try{
        serve({
            fetch: server.fetch,
            port: PORT,
        });

        console.log('comment service started at port:', PORT);
    } catch(err) {
        console.error('comment service shutting down', err);
        process.exit(1);
    }
}

server();