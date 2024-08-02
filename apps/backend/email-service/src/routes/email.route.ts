import { Hono } from "hono";
import { createSubscriptionHandler, helloHandler } from "../handler/subscription.handler";
import { errorMiddleware } from "../middleware/error.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import rateLimiter from "../rate-limiter/rate.limiter";
import {prometheus} from "@hono/prometheus";

const router = new Hono();

const rateLimiterOptions = {
    windowMs : 15*60*1000,
    max:5
};

const {printMetrics , registerMetrics} = prometheus();
router.use("*",registerMetrics);

router.get('/metrics',printMetrics);

router.post('/email', authMiddleware,rateLimiter(rateLimiterOptions),errorMiddleware, createSubscriptionHandler);

router.get('/hello',authMiddleware,rateLimiter(rateLimiterOptions),errorMiddleware,helloHandler);

export default router;