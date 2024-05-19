import { Document } from 'mongoose';

export interface IUserVote {
  userId: string;
  vote: number;
}

export interface IVote extends Document {
  blogId: string;
  votes: IUserVote[];
  voteCount: number;
  updateVoteCount(): number;
}
