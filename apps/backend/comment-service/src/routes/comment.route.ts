import { Hono } from "hono";
import { createComment } from "../services/comment.service";
import authHeleprs, { Variables } from '@repo/auth-config';

const router = new Hono<{ Variables: Variables }>();
router.use('*', authHeleprs.authSessionMiddleware);

router.post('/create', authHeleprs.withAuthMiddleware, (c) => createComment(c));

export default router;