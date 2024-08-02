import { Hono } from "hono";
import { createContactHandler, getHello } from "../handler/contact.handler";
import { errorMiddleware } from "../middleware/error.middleware";
import { authorize } from "../middleware/auth.middleware";
import rateLimiter from "../rate-limiter/rate.limiter";
import { prometheus } from "@hono/prometheus";

const router = new Hono();
const rateLimitOptions = {
    windowMs: 15 * 60 * 1000,
    max: 5 
};

const {printMetrics, registerMetrics} = prometheus();
router.use('*',registerMetrics);

router.get('/metrics',printMetrics);


router.post('/create',authorize,rateLimiter(rateLimitOptions), errorMiddleware,createContactHandler);
router.get('/hello',authorize,rateLimiter(rateLimitOptions), errorMiddleware,getHello);

export default router;