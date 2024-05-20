import { Hono } from 'hono';
import {
  createCommentHandler,
  deleteCommentHandler,
  getAllCommentsHandler,
  updateCommentHandler,
} from '../handler/comment.handler';
import { createCommentValidator } from '../validations/comment.validation';
import auth, { Variables } from '@repo/auth-config';

const router = new Hono<{ Variables: Variables }>();

router.post('/create', auth.withAuthMiddleware, createCommentValidator, createCommentHandler);
router.get('/comments/:blogId', getAllCommentsHandler);
router.post('/update', auth.withAuthMiddleware, updateCommentHandler);
router.delete('/delete', auth.withAuthMiddleware, deleteCommentHandler);

export default router;
