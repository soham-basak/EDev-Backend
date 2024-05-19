import { Vote } from '../models/vote.model';
import { Context } from 'hono';

// Upvote handler
export const upvote = async (c: Context) => {
  const { blogId, userId } = await c.req.json();
  let voteDoc = await Vote.findOne({ blogId });

  if (!voteDoc) {
    voteDoc = new Vote({ blogId, votes: [] });
  }

  const userVoteIndex = voteDoc.votes.findIndex((v) => v.userId === userId);

  if (userVoteIndex !== -1) {
    voteDoc.votes[userVoteIndex].vote = 1;
  } else {
    voteDoc.votes.push({ userId, vote: 1 });
  }

  voteDoc.updateVoteCount();
  await voteDoc.save();

  return c.json({ message: 'Upvoted successfully.' });
};

// Downvote handler
export const downvote = async (c: Context) => {
  const { blogId, userId } = await c.req.json();
  let voteDoc = await Vote.findOne({ blogId });

  if (!voteDoc) {
    voteDoc = new Vote({ blogId, votes: [] });
  }

  const userVoteIndex = voteDoc.votes.findIndex((v) => v.userId === userId);

  if (userVoteIndex !== -1) {
    voteDoc.votes[userVoteIndex].vote = -1;
  } else {
    voteDoc.votes.push({ userId, vote: -1 });
  }

  voteDoc.updateVoteCount();
  await voteDoc.save();

  return c.json({ message: 'Downvoted successfully.' });
};

// Get all votes by blogId handler
export const getAllVotes = async (c: Context) => {
  const { blogId } = c.req.param();
  const voteDoc = await Vote.findOne({ blogId });

  if (!voteDoc) {
    return c.json({ votes: [], voteCount: 0 });
  }

  return c.json({ votes: voteDoc.votes, voteCount: voteDoc.voteCount });
};

export const removeVote = async (c: Context) => {
  const { blogId, userId } = await c.req.json();
  let voteDoc = await Vote.findOne({ blogId });

  if (!voteDoc) {
    return c.json({ message: 'Vote document not found.' }, 404);
  }

  const userVoteIndex = voteDoc.votes.findIndex((v) => v.userId === userId);

  if (userVoteIndex === -1) {
    return c.json({ message: 'User vote not found.' }, 404);
  }

  voteDoc.votes.splice(userVoteIndex, 1); // Remove the user's vote
  voteDoc.updateVoteCount();
  await voteDoc.save();

  return c.json({ message: 'Vote removed successfully.' });
};
