import { read } from "fs";
import Post from "../models/Post";
import { Context } from "hono";

// @desc    Create blog comment
// route    POST /api/v1/create
// access   private

export const createPostHandler = async(c: Context) => {
  
    try {
      const {
          title,
          slug,
          isFeatured,
          isLatest,
          coverImg,
          category,
          excerpt,
          content,
          author,
          tags
      } = await c.req.json();
  
      const requiredFields = {
          title,
          slug,
          isFeatured,
          isLatest,
          coverImg,
          category,
          excerpt,
          content,
          author,
          tags
      };
  
      for (const [field, value] of Object.entries(requiredFields)) {
          if (!value) {
              return c.json({ error: `Missing required field: ${field}` }, 400);
          }
      }
  
      const newPost = new Post({
          title,
          slug,
          isFeatured,
          isLatest,
          coverImg,
          category,
          excerpt,
          content,
          author,
          tags
      });
  
      await newPost.save();
      console.log('Post saved successfully');
      return c.json({ message: 'Post saved successfully' }, 201);
  } catch (error) {
      console.error('Error saving post:', error);
      return c.json({ error: 'Failed to save post' }, 500);
  }

}

// @desc    Get Single blog post
// route    GET /api/v1/blog/:id
// access   private

export const readPostHandler = async(c: Context) => {
    try {
        const  {id}  = c.req.param();
        const post = await Post.findById(id);
        if (!post) {
            return c.json({ error: 'Post not found' }, 404);
        }
        return c.json(post, 200);

        
    } catch (error) {
        console.log('Error fetching post:', error);
        return c.json({ error: 'Failed to fetch post' }, 500);
        
    }
}

// @desc    Get All blog post
// route    GET /api/v1/blog/
// access   private

export const readAllPostHandler = async(c: Context) => {
    try {
        const posts = await Post.find();
        if (!posts || posts.length === 0) {
            return c.json({ error: 'No posts found' }, 200);
        }
        return c.json(posts, 200);
    } catch (error) {
        console.log('Error fetching posts:', error);
        return c.json({ error: 'Failed to fetch posts' }, 500);
    }
}

// @desc    Update Single blog post
// route    PUT /api/v1/blog/:id
// access   private

export const updatePostHandler = async(c: Context) => {
    try {
        const { id } = c.req.param();
        const updateData = await c.req.json();
        const updatedPost = await Post.findByIdAndUpdate(id, updateData, {new: true});
        if (!updatedPost) {
            return c.json({ error: 'Post not found' }, 404);
        }
        return c.json(updatedPost, 200);

    } catch (error) {
        console.log('Error updating post:', error);
        return c.json({ error: 'Failed to update post' }, 500);
        
    }
}

// @desc    Delete Single blog post
// route    DELETE /api/v1/blog/:id
// access   private

export const deletePostHandler = async(c: Context) => {
    try {
        const { id } = c.req.param();
        const deletePost = await Post.findByIdAndDelete(id);
        if (!deletePost) {
            return c.json({ error: 'Post not found' }, 404);
        }
        return c.json({ message: 'Post deleted successfully' }, 200);
    } catch (error) {
        console.log('Error deleting post:', error);
        return c.json({ error: 'Failed to delete post' }, 500);
        
    }
}
