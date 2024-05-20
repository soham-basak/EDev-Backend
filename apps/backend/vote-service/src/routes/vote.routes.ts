import { Hono } from 'hono';

import { upvote, downvote, getAllVotes, removeVote } from '../handlers/vote.handler';
import auth, { Variables } from '@repo/auth-config';

const router = new Hono<{ Variables: Variables }>();

router.post('/upvote', auth.withAuthMiddleware, upvote);
router.post('/downvote', auth.withAuthMiddleware, downvote);
router.get('/votes/:blogId', getAllVotes);
router.post('/removevote', auth.withAuthMiddleware, removeVote);

export default router;
