import { Hono } from 'hono';
import {
  createCommentHandler,
  deleteCommentHandler,
  getAllCommentsHandler,
  updateCommentHandler,
} from '../handler/comment.handler';
import {
  createCommentValidator,
  deleteCommentValidator,
  getAllCommentsValidator,
  updateCommentValidator,
} from '../validations/comment.validation';
import auth, { Variables } from '@repo/auth-config';

const router = new Hono<{ Variables: Variables }>();

router.post('/create', auth.withAuthMiddleware, createCommentValidator, createCommentHandler);
router.get('/comments/:blogId', getAllCommentsValidator, getAllCommentsHandler);
router.put('/update', auth.withAuthMiddleware, updateCommentValidator, updateCommentHandler);
router.delete(
  '/delete/:commentId/:blogId',
  auth.withAuthMiddleware,
  deleteCommentValidator,
  deleteCommentHandler
);

export default router;
