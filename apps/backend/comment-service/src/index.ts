import { serve } from "bun";
import { Hono } from "hono";

async function main() {
  const server = new Hono();

  const PORT = 8787;

  server.get("/", (c) => {
    return c.json({
      message: "comment-service"
    })
  })

  try {
    serve({
      fetch: server.fetch,
      port: PORT,
    });

    console.log('comment service started at port:', PORT);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();