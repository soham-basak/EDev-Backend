import { handleErrors } from '@repo/util-config';
import { Context } from 'hono';
import { User, Variables } from '@repo/auth-config';
import { Vote } from '../models/vote.model';
import { z } from 'zod';
import { HTTPException } from 'hono/http-exception';

// Upvote handler
export const upvote = async (c: Context<{ Variables: Variables }>) => {
  const upvoteSchema = z.object({
    blogId: z.string(),
  });
  try {
    const { blogId } = upvoteSchema.parse(await c.req.json());
    const user = c.get('user') as User;
    const userId = user.id;
    let voteDoc = await Vote.findOne({ blogId });

    if (!voteDoc) {
      voteDoc = new Vote({ blogId, votes: [] });
    }

    const userVoteIndex = voteDoc.votes.findIndex((v) => v.userId === userId);
    const userVote = voteDoc.votes[userVoteIndex];

    if (userVote?.vote === 1) {
      throw new HTTPException(409, {
        message: 'already voted.',
      });
    }

    if (userVoteIndex !== -1) {
      voteDoc.votes[userVoteIndex].vote = 1;
    } else {
      voteDoc.votes.push({ userId, vote: 1 });
    }

    voteDoc.updateVoteCount();
    await voteDoc.save();

    return c.json({ message: 'Upvoted successfully.' });
  } catch (err) {
    console.error('upvoteHandler error: ', err);

    return handleErrors(c, err);
  }
};

// Downvote handler
export const downvote = async (c: Context) => {
  try {
    const { blogId } = await c.req.json();
    const user = c.get('user') as User;
    const userId = user.id;
    let voteDoc = await Vote.findOne({ blogId });

    if (!voteDoc) {
      voteDoc = new Vote({ blogId, votes: [] });
    }

    const userVoteIndex = voteDoc.votes.findIndex((v) => v.userId === userId);
    const userVote = voteDoc.votes[userVoteIndex];

    if (userVote?.vote === -1) {
      throw new HTTPException(409, {
        message: 'already downvoted.',
      });
    }

    if (userVoteIndex !== -1) {
      voteDoc.votes[userVoteIndex].vote = -1;
    } else {
      voteDoc.votes.push({ userId, vote: -1 });
    }

    voteDoc.updateVoteCount();
    await voteDoc.save();

    return c.json({ message: 'Downvoted successfully.' });
  } catch (err) {
    console.error('downvoteHandler error: ', err);

    return handleErrors(c, err);
  }
};

// Get all votes by blogId handler
export const getAllVotes = async (c: Context) => {
  try {
    const { blogId } = c.req.param();
    const voteDoc = await Vote.findOne({ blogId });

    if (!voteDoc) {
      return c.json({ votes: [], voteCount: 0 });
    }

    return c.json({ votes: voteDoc.votes, voteCount: voteDoc.voteCount });
  } catch (err) {
    console.error('getAllVotes error: ', err);

    return handleErrors(c, err);
  }
};

export const removeVote = async (c: Context) => {
  try {
    const { blogId } = await c.req.json();
    const user = c.get('user') as User;
    const userId = user.id;
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
  } catch (err) {
    console.error('removeVoteHandler error: ', err);

    return handleErrors(c, err);
  }
};
