import { Hono } from 'hono';
import { createComment } from '../services/comment.service';
import { Variables } from '@repo/auth-config';

const router = new Hono<{ Variables: Variables }>();

router.post('/create', createComment);

export default router;
