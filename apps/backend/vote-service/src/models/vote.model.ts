import mongoose, { Schema, Document, Model } from 'mongoose';
import { IVote, IUserVote } from '../../types';

const userVoteSchema: Schema<IUserVote> = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    vote: {
      type: Number,
      required: true,
      enum: [1, -1],
    },
  },
  { _id: false }
);

const voteSchema: Schema<IVote> = new Schema({
  blogId: {
    type: String,
    required: true,
  },
  votes: [userVoteSchema],
  voteCount: {
    type: Number,
    required: true,
    default: 0,
  },
});

voteSchema.methods.updateVoteCount = function () {
  this.voteCount = this.votes.reduce((total: number, vote: IUserVote) => total + vote.vote, 0);
  return this.voteCount;
};

const Vote: Model<IVote> = mongoose.model<IVote>('Vote', voteSchema);

export { Vote, IVote, IUserVote };
