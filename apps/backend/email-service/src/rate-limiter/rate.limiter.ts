import { Context,Next } from "hono";

interface RateLimiterOptions {
    windowMs: number;
    max: number;
}

const rateLimiter = (options: RateLimiterOptions) => {
    const { windowMs, max } = options; 
    const requestCounts: { [key: string]: { count: number; timestamp: number } } = {}; 

    return async (c: Context, next: Next) => { 
        const headers = Array.from(c.req.raw.headers.entries());
        console.log('Request Headers:', headers); 

        let ip = c.req.header('x-forwarded-for') || 
            c.req.header('x-real-ip') ||
            c.req.raw.headers.get('cf-connecting-ip') ||
            c.req.raw.headers.get('x-forwarded') ||
            c.req.raw.headers.get('forwarded-for') ||
            c.req.raw.headers.get('forwarded') ||
            c.req.raw.headers.get('via') ||
            c.req.raw.headers.get('remote-addr') ||
            c.req.raw.headers.get('remote_addr') ||
            c.req.raw.headers.get('x-client-ip') ||
            c.req.raw.headers.get('x-cluster-client-ip') ||
            c.req.raw.headers.get('x-forwarded-for') ||
            c.req.raw.headers.get('x-forwarded-host') ||
            c.req.raw.headers.get('x-forwarded-port') ||
            c.req.raw.headers.get('x-forwarded-proto') ||
            c.req.raw.headers.get('x-forwarded-server') ||
            c.req.raw.headers.get('x-forwarded-for') ||
            c.req.raw.headers.get('true-client-ip') ||
            c.req.raw.headers.get('client-ip') ||
            c.req.raw.headers.get('real-ip') ||
            c.req.raw.headers.get('remote-addr') ||
            c.req.raw.headers.get('remote_addr') ||
            '127.0.0.1';  

        if (ip.includes(',')) { 
            ip = ip.split(',')[0].trim();
        }

        console.log('Request IP:', ip); 

        if (!ip) { 
            return c.json({ error: 'Unable to determine IP address' }, 400);
        }

        const now = Date.now(); 
        const requestLog = requestCounts[ip] || { count: 0, timestamp: now }; 

        if (now - requestLog.timestamp > windowMs) { 
            requestLog.count = 1; 
            requestLog.timestamp = now;
        } else { 
            requestLog.count += 1;
        }

        requestCounts[ip] = requestLog; 

        if (requestLog.count > max) { 
            return c.json({ error: 'Too many requests, please try again later.' }, 429); 
        }

        await next(); 
    };
};

export default rateLimiter;
