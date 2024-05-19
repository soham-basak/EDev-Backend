import Comment from '../models/comment.model';
import { z } from 'zod';
import { Context } from 'hono';
import { User, Variables } from '@repo/auth-config';

const createComment = async (c: Context<{ Variables: Variables }>) => {
  const commentSchema = z.object({
    blogId: z.string(),
    commentText: z.string(),
  });

  try {
    const { blogId, commentText } = commentSchema.parse(await c.req.json());
    const user = c.get('user') as User;

    const newComment = new Comment({
      blogId,
      userId: user.id,
      userName: user.username,
      commentText,
    });

    const savedComment = await newComment.save();
    return c.json(savedComment, 201);
  } catch (error: any) {
    console.error('Server error:', error);
    return c.json({ message: `Server error: ${error.message}` }, 500);
  }
};

export { createComment };
