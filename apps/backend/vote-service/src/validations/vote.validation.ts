import { zValidator } from '@hono/zod-validator';
import { ExtractDetails } from '@repo/util-config';
import { z } from 'zod';

const voteSchema = z.object({
  blogId: z.string(),
});

export const voteJSONValidator = zValidator('json', voteSchema, (result, c) => {
  if (!result.success) {
    return c.json({ errorMsg: result.error.flatten().fieldErrors });
  }
});

export const voteParamValidator = zValidator('param', voteSchema, (result, c) => {
  if (!result.success) {
    return c.json({ errorMsg: result.error.flatten().fieldErrors });
  }
});

export type VoteJSONValidator = ExtractDetails<Parameters<typeof voteJSONValidator>['0']>;
export type VoteParamValidator = ExtractDetails<Parameters<typeof voteParamValidator>['0']>;
