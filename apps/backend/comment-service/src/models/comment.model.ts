import mongoose, { Schema } from 'mongoose';
import { IComment } from '../../types';

const commentSchema: Schema = new Schema({
  blogId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  userImage: {
    type: String,
  },
  commentText: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const Comment = mongoose.model<IComment>('Comment', commentSchema);
export default Comment;
