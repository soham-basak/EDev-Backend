import { Context, Next } from 'hono';
import { env } from '../validations/env';

export const authorize = async (c: Context, next: Next) => {
    const authHeader = c.req.header('Authorization'); // Get the Authorization header
    const TOKEN_SECRET = String(env.TOKEN_SECRET); // Get the token secret from the environment variables

    if (!authHeader || !authHeader.startsWith('Bearer ')) { // Check if the Authorization header is present and starts with 'Bearer '
        return c.json({ error: 'Unauthorized' }, 401); // Return an error if the Authorization header is not present or does not start with 'Bearer '
    }

    const token = authHeader.split(' ')[1]; // Get the token from the Authorization header by splitting the header and taking the second part

    if (token !== TOKEN_SECRET) {
        return c.json({ error: 'Unauthorized' }, 401); // Return an error if the token does not match the token secret
    }

    await next(); // Call the next middleware or handler if the token is valid
};
