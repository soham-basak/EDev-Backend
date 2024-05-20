import { Hono } from 'hono';

import { upvote, downvote, getAllVotes, removeVote } from '../handlers/vote.handler';
import { Variables } from '@repo/auth-config';

const router = new Hono<{ Variables: Variables }>();

router.post('/upvote', upvote);
router.post('/downvote', downvote);
router.get('/votes/:blogId', getAllVotes);
router.post('/removevote', removeVote);

export default router;
