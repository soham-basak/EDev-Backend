import Comment from '../models/comment.model';
import { z } from 'zod';
import { Context } from 'hono';

const createComment = async (c : Context) => {
    const commentSchema = z.object({
        blogID: z.string(),
        userId: z.string(),
        userName: z.string(),
        commentText: z.string(),
    });

    try{
        const {blogID, commentText} = commentSchema.parse(c.req.json());
        const user = c.get('user');

        const newComment = new Comment({
            blogID,
            userId: user.id,
            userName: user.name,
            commentText
        })

        const savedComment = await newComment.save();
        return c.json(savedComment, 201);
    } catch (error:any) {
        console.error("Server error:", error);
        return c.json({ message: `Server error: ${error.message}` }, 500);
    }
}

export { createComment };