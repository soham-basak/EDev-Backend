import mongoose, { Schema} from 'mongoose';
import { IPost } from '../../types';

// Define the Post schema
const PostSchema: Schema = new Schema<IPost>({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  isFeatured:{
    type: Boolean,
    default: true,
  },
  isLatest:{
    type: Boolean,
    default: true,
  },
  coverImg: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Export the Post model
const Post = mongoose.model<IPost>('Post', PostSchema);
export default Post;
