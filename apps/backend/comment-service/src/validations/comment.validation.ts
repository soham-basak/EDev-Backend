import { zValidator } from '@hono/zod-validator';
import { ExtractDetails } from '@repo/util-config';
import { z } from 'zod';

export const createCommentSchema = z.object({
  blogId: z.string().min(2, { message: 'blogId is required' }),
  commentText: z.string().min(5),
});

const getAllCommentsSchema = z.object({
  blogId: z.string().min(2, { message: 'blogId is required' }),
});

const updateCommentSchema = z.object({
  commentId: z.string(),
  commentText: z.string(),
});

const deleteCommentSchema = z.object({
  commentId: z.string(),
});

export const createCommentValidator = zValidator('json', createCommentSchema, (result, c) => {
  if (!result.success) {
    return c.json({ errorMsg: result.error.flatten().fieldErrors }, 422);
  }
});

export const getAllCommentsValidator = zValidator('param', getAllCommentsSchema, (result, c) => {
  if (!result.success) {
    return c.json({ errorMsg: result.error.flatten().fieldErrors }, 422);
  }
});

export const updateCommentValidator = zValidator('json', updateCommentSchema, (result, c) => {
  if (!result.success) {
    return c.json({ errorMsg: result.error.flatten().fieldErrors }, 422);
  }
});

export const deleteCommentValidator = zValidator('json', deleteCommentSchema, (result, c) => {
  if (!result.success) {
    return c.json({ errorMsg: result.error.flatten().fieldErrors }, 422);
  }
});

export type CreateCommentValidator = ExtractDetails<Parameters<typeof createCommentValidator>['0']>;
export type GetAllCommentsValidator = ExtractDetails<
  Parameters<typeof getAllCommentsValidator>['0']
>;
export type UpdateCommentValidator = ExtractDetails<Parameters<typeof updateCommentValidator>['0']>;
export type DeleteCommentValidator = ExtractDetails<Parameters<typeof deleteCommentValidator>['0']>;
