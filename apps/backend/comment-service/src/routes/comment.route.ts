import { Hono } from 'hono';
import {
  createCommentHandler,
  deleteCommentHandler,
  getAllCommentsHandler,
  updateCommentHandler,
} from '../handler/comment.handler';
import { createCommentValidator } from '../validations/comment.validation';
import { Variables } from '@repo/auth-config';

const router = new Hono<{ Variables: Variables }>();

router.post('/create', createCommentValidator, createCommentHandler);
router.get('/comments/:blogId', getAllCommentsHandler);
router.post('/update', updateCommentHandler);
router.delete('/delete', deleteCommentHandler);

export default router;
