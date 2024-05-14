import { serve } from "@hono/node-server";
import createServer from "./server";
import config from "./config/default";

async function main() {
  const server = createServer(config);

  const PORT = Number(config.port ?? "5000");

  try {
    serve({
      fetch: server.fetch,
      port: PORT,
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
