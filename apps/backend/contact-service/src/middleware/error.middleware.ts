import { Context, Next } from "hono";
import { any } from "zod";

export const errorMiddleware = async (c: Context, next: Next) => {
    try {
        await next();
    }
    catch (error) {
        console.error("Unhandled error:", error);
        if (error instanceof SyntaxError) {
            return c.json({ error: 'Invalid JSON format' }, 400);
        }

        if ((error as any).name === 'ValidationError') {
            return c.json({ error: 'Validation failed', details: (error as any).message }, 400);
        }

        if ((error as any).name === 'MongoError') {
            return c.json({ error: 'Database error', details: (error as any).message }, 500);
        }
        return c.json({ error: 'Internal server error' }, 500);
    }
}
