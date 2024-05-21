import { Hono } from 'hono';

import {
  downvoteHandler,
  getAllVotesHandler,
  removeVoteHandler,
  upvoteHandler,
} from '../handlers/vote.handler';
import auth, { Variables } from '@repo/auth-config';
import { voteJSONValidator, voteParamValidator } from '../validations/vote.validation';

const router = new Hono<{ Variables: Variables }>();

router.post('/upvote', auth.withAuthMiddleware, voteJSONValidator, upvoteHandler);
router.post('/downvote', auth.withAuthMiddleware, voteJSONValidator, downvoteHandler);
router.get('/votes/:blogId', voteParamValidator, getAllVotesHandler);
router.post('/removevote', auth.withAuthMiddleware, voteJSONValidator, removeVoteHandler);

export default router;
