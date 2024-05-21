import { handleErrors } from '@repo/util-config';
import { Context } from 'hono';
import { User, Variables } from '@repo/auth-config';
import { Vote } from '../models/vote.model';
import { HTTPException } from 'hono/http-exception';
import { type VoteJSONValidator, type VoteParamValidator } from '../validations/vote.validation';

// Upvote handler
export const upvoteHandler = async (
  c: Context<{ Variables: Variables }, '', VoteJSONValidator>
) => {
  try {
    const { blogId } = c.req.valid('json');
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

    return c.json('upvoted', 200);
  } catch (err) {
    console.error('upvoteHandler error: ', err);

    return handleErrors(c, err);
  }
};

// Downvote handler
export const downvoteHandler = async (
  c: Context<{ Variables: Variables }, '', VoteJSONValidator>
) => {
  try {
    const { blogId } = c.req.valid('json');
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

    return c.json('downvoted', 200);
  } catch (err) {
    console.error('downvoteHandler error: ', err);

    return handleErrors(c, err);
  }
};

// Get all votes by blogId handler
export const getAllVotesHandler = async (
  c: Context<{ Variables: Variables }, '', VoteParamValidator>
) => {
  try {
    const { blogId } = c.req.valid('param');

    const voteDoc = await Vote.findOne({ blogId });

    if (!voteDoc) {
      throw new HTTPException(404, {
        message: 'no votes with this blogId found.',
      });
    }

    return c.json({ votes: voteDoc.votes, voteCount: voteDoc.voteCount });
  } catch (err) {
    console.error('getAllVotesHandler error: ', err);

    return handleErrors(c, err);
  }
};

// remove vote by blogId handler
export const removeVoteHandler = async (
  c: Context<{ Variables: Variables }, '', VoteJSONValidator>
) => {
  try {
    const { blogId } = c.req.valid('json');
    const user = c.get('user') as User;
    const userId = user.id;

    let voteDoc = await Vote.findOne({ blogId });

    if (!voteDoc) {
      throw new HTTPException(404, {
        message: 'user vote not found.',
      });
    }

    const userVoteIndex = voteDoc.votes.findIndex((v) => v.userId === userId);

    if (userVoteIndex === -1) {
      throw new HTTPException(404, {
        message: 'user vote not found.',
      });
    }

    voteDoc.votes.splice(userVoteIndex, 1); // Remove the user's vote
    voteDoc.updateVoteCount();
    await voteDoc.save();

    return c.json('vote removed', 200);
  } catch (err) {
    console.error('removeVoteHandler error: ', err);

    return handleErrors(c, err);
  }
};
