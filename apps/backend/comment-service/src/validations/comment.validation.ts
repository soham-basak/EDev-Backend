import { zValidator } from '@hono/zod-validator';
import { Context } from 'hono';
import { z } from 'zod';

type ExtractDetails<T> = T extends Context<any, any, infer U> ? U : never;

export const createCommentSchema = z.object({
  blogId: z.string(),
  commentText: z.string(),
});

export const createCommentValidator = zValidator('json', createCommentSchema, (result, c) => {
  if (!result.success) {
    return c.json({ errorMsg: result.error.flatten().fieldErrors }, 422);
  }
});

export type CreateCommentValidator = ExtractDetails<Parameters<typeof createCommentValidator>['0']>;
