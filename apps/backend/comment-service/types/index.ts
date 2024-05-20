import { Document } from 'mongoose';

export interface IComment extends Document {
  blogId: string;
  userName: string;
  userId: string;
  commentText: string;
  createdAt: Date;
}
