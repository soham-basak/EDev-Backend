import { Context,Next } from "hono";
import { env } from "../validation/env";

export const authMiddleware = async (c: Context, next: Next) => {
    const authHeader = c.req.header('Authorization');
    const TOKEN_SECRET = String(env.TOKEN_SECRET);

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({error: 'Unauthorized'}, 401);
    }

    const token = authHeader.split(' ')[1];

    if(token !== TOKEN_SECRET) {
        return c.json({error: 'Unauthorized'}, 401);
    }

    await next();

}