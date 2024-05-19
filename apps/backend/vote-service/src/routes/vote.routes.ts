import { Hono } from 'hono';

import { upvote, downvote, getAllVotes, removeVote } from '../handlers/vote.handler';

const router = new Hono();

router.post('/upvote', upvote);
router.post('/downvote', downvote);
router.get('/votes/:blogId', getAllVotes);
router.post('/removeVote', removeVote);

export default router;
