import mongoose, { Schema, Document } from "mongoose";
import { IComment } from "../../types";

const commentSchema: Schema = new Schema({
  blogID: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userID: {
    type: String,
    required: true,
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

const Comment = mongoose.model<IComment>("Comment", commentSchema);
export default Comment;