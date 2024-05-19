import { Document } from 'mongoose';

export interface IComment extends Document {
  blogID: string;
  userName: string;
  userID: string;
  commentText: string;
  createdAt: Date;
}
