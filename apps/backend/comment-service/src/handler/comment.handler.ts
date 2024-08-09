import Comment from '../models/comment.model';
import { Context } from 'hono';
import { User, Variables } from '@repo/auth-config';
import { handleErrors } from '@repo/util-config';
import {
  CreateCommentValidator,
  DeleteCommentValidator,
  GetAllCommentsValidator,
  UpdateCommentValidator,
} from '../validations/comment.validation';
import { HTTPException } from 'hono/http-exception';

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
      userImage: user?.image,
      userName: user.username,
      commentText,
    });

    await newComment.save();

    return c.json(newComment, 201);
  } catch (err) {
    console.error('createCommentHanlder error: ', err);

    return handleErrors(c, err);
  }
};

// @desc    Get all comments by blog ID
// route    GET /api/v1/comments/:blogId
// access   public
export const getAllCommentsHandler = async (
  c: Context<{ Variables: Variables }, '', GetAllCommentsValidator>
) => {
  try {
    const { blogId } = c.req.valid('param');
    const comments = await Comment.find({ blogId });

    if (comments?.length === 0) {
      throw new HTTPException(404, {
        message: 'No comments found for this blog.',
      });
    }

    return c.json(comments, 200);
  } catch (error) {
    console.error('getAllCommentsHandler error: ', error);

    return handleErrors(c, error);
  }
};

// @desc    Update blog comment
// route    PUT /api/v1/update
// access   private
export const updateCommentHandler = async (
  c: Context<{ Variables: Variables }, '', UpdateCommentValidator>
) => {
  try {
    const { commentId, commentText } = c.req.valid('json');
    const user = c.get('user') as User;

    // Find the comment by its ID
    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new HTTPException(404, {
        message: 'No comment found',
      });
    }

    // Check if the user is the owner of the comment
    if (comment.userId !== user.id) {
      throw new HTTPException(401, {
        message: 'Unauthorized',
      });
    }

    // Update the comment text
    comment.commentText = commentText;
    await comment.save();

    return c.json(comment, 200);
  } catch (error) {
    console.error('updateCommentHandler error:', error);

    return handleErrors(c, error);
  }
};

// @desc    Delete blog comment
// route    DELETE /api/v1/delete
// access   private
export const deleteCommentHandler = async (
  c: Context<{ Variables: Variables }, '', DeleteCommentValidator>
) => {
  try {
    const { commentId } = c.req.valid('json');
    const user = c.get('user') as User;

    // Find the comment by its ID
    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new HTTPException(404, {
        message: 'No comment found',
      });
    }

    // Check if the user is the owner of the comment
    if (comment.userId !== user.id) {
      throw new HTTPException(401, {
        message: 'Unauthorized',
      });
    }

    // Delete the comment
    await Comment.deleteOne({ _id: commentId });

    return c.json(comment, 200);
  } catch (error) {
    console.error('deleteCommentHandler error:', error);

    return handleErrors(c, error);
  }
};
