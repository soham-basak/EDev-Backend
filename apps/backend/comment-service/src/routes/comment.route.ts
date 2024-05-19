import { Hono } from 'hono';
import { createComment, deleteComment, getAllComments, updateComment } from '../services/comment.service';
import { Variables } from '@repo/auth-config';

const router = new Hono<{ Variables: Variables }>();

router.post('/create', createComment);
router.get('/comments/:blogId', getAllComments);
router.post('/update', updateComment);
router.delete('/delete', deleteComment);

export default router;
