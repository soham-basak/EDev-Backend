import Comment from '../models/comment.model';
import { Context } from 'hono';
import { User, Variables } from '@repo/auth-config';
import { CreateCommentValidator } from '../validations/comment.validation';
import { z } from 'zod';
import { handleErrors } from '@repo/util-config';

// @desc    Create blog comment
// route    POST /api/v1/create
// access   private
export const createCommentHandler = async (
  c: Context<{ Variables: Variables }, '', CreateCommentValidator>
) => {
  try {
    const { blogId, commentText } = c.req.valid('json');

    const user = c.get('user') as User;

    const newComment = new Comment({
      blogId,
      userId: user.id,
      userName: user.username,
      commentText,
    });

    const savedComment = await newComment.save();
    return c.json(savedComment, 201);
  } catch (err) {
    console.error('createCommentHanlder error: ', err);

    return handleErrors(c, err);
  }
};

// @desc    Get all comments by blog ID
// route    GET /api/v1/comments/:blogId
// access   public
export const getAllCommentsHandler = async (c: Context<{ Variables: Variables }>) => {
  const paramsSchema = z.object({
    blogId: z.string().nonempty({ message: 'blogId is required and must be a string' }),
  });

  try {
    const { blogId } = paramsSchema.parse(c.req.param());

    const blogID = blogId;

    const comments = await Comment.find({ blogId });

    if (comments.length === 0) {
      return c.json({ message: 'No comments found for this blog.' }, 404);
    }

    return c.json(comments, 200);
  } catch (error: any) {
    console.error('Validation or server error:', error);
    if (error instanceof z.ZodError) {
      return c.json({ errors: error.errors }, 400);
    }
    return c.json({ message: `Server error: ${error.message}` }, 500);
  }
};

// @desc    Update blog comment
// route    PUT /api/v1/update
// access   private
export const updateCommentHandler = async (c: Context<{ Variables: Variables }>) => {
  const updateCommentSchema = z.object({
    commentId: z.string(),
    commentText: z.string(),
  });

  try {
    const { commentId, commentText } = updateCommentSchema.parse(await c.req.json());
    const user = c.get('user') as User;

    // Find the comment by its ID
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return c.json({ message: 'Comment not found' }, 404);
    }

    // Check if the user is the owner of the comment
    if (comment.userId !== user.id) {
      // userID will be change to -> userId
      return c.json({ message: 'Unauthorized' }, 401);
    }

    // Update the comment text
    comment.commentText = commentText;
    const updatedComment = await comment.save();

    return c.json(updatedComment, 200);
  } catch (error: any) {
    console.error('Server error:', error);
    return c.json({ message: `Server error: ${error.message}` }, 500);
  }
};

// @desc    Delete blog comment
// route    DELETE /api/v1/delete
// access   private
export const deleteCommentHandler = async (c: Context<{ Variables: Variables }>) => {
  const deleteCommentSchema = z.object({
    commentId: z.string(),
  });

  try {
    const { commentId } = deleteCommentSchema.parse(await c.req.json());
    const user = c.get('user') as User;

    // Find the comment by its ID
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return c.json({ message: 'Comment not found' }, 404);
    }

    // Check if the user is the owner of the comment
    if (comment.userId !== user.id) {
      // userID will be change to -> userId
      return c.json({ message: 'Unauthorized' }, 401);
    }

    // Delete the comment
    await Comment.findByIdAndDelete(commentId);

    return c.json({ message: 'Comment deleted successfully' }, 200);
  } catch (error: any) {
    console.error('Server error:', error);
    return c.json({ message: `Server error: ${error.message}` }, 500);
  }
};
