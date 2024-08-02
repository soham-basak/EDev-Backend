import { Context, Next } from 'hono';

interface RateLimitOptions { // Define the RateLimitOptions interface
    windowMs: number;
    max: number;
}

const rateLimiter = (options: RateLimitOptions) => { // Create a rateLimiter middleware function that takes the RateLimitOptions as an argument
    const { windowMs, max } = options; // Destructure the windowMs and max from the options object
    const requestCounts: { [key: string]: { count: number; timestamp: number } } = {}; // Create an object to store the request counts for each IP address

    return async (c: Context, next: Next) => { // Return an async middleware function that takes the Context and Next as arguments
        const headers = Array.from(c.req.raw.headers.entries()); // Get the request headers
        // console.log('Request Headers:', headers); // Log the request headers

        let ip = c.req.header('x-forwarded-for') ||  // Get the client IP address from the request headers
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

        if (ip.includes(',')) { // Check if the IP address contains multiple addresses
            ip = ip.split(',')[0].trim(); // Get the first IP address from the list
        }

        // console.log('Request IP:', ip); // Log the client IP address

        if (!ip) { // Check if the IP address is not present
            return c.json({ error: 'Unable to determine IP address' }, 400);
        }

        const now = Date.now(); // Get the current timestamp
        const requestLog = requestCounts[ip] || { count: 0, timestamp: now }; // Get the request log for the IP address or create a new log if it does not exist

        if (now - requestLog.timestamp > windowMs) { // Check if the window has expired
            requestLog.count = 1; // Reset the request count
            requestLog.timestamp = now; // Update the timestamp
        } else {  // If the window has not expired
            requestLog.count += 1; // Increment the request count
        }

        requestCounts[ip] = requestLog; // Update the request log for the IP address

        if (requestLog.count > max) { // Check if the request count exceeds the maximum limit
            return c.json({ error: 'Too many requests, please try again later.' }, 429); // Return an error response
        }

        await next(); // Call the next middleware or handler
    };
};

export default rateLimiter;
