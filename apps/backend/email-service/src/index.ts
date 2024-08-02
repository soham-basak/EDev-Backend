import { env } from "./validation/env";
import createEmailServer from "./server"; 
import {serve} from "@hono/node-server";

async function server(){
  const server = createEmailServer();
  const PORT = Number(env.PORT);

  try{
    serve({
      fetch: server.fetch,
      port: PORT,
    });
    console.log(`Server running on port ${PORT}`);
  }catch(err){
    console.error('Error starting server:', err);
    process.exit(1);
  }

}

server();