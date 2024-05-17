import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { Context } from 'hono';

type ExtractDetails<T> = T extends Context<any, any, infer U> ? U : never;

// Validation for the user data returned by Google.
export const googleUserValidationSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  picture: z.string().url(),
});

// Validation for the user data returned by GitHub.
export const githubUserValidationSchema = z.object({
  email: z.string().email(),
  login: z.string(),
  avatar_url: z.string().url(),
});

// Validation for the Query Parameters of the callback request.
const callbackValidationSchema = z.object({
  code: z.string().min(2),
  state: z.string().min(2),
});

export const callbackValidator = zValidator('query', callbackValidationSchema, (result, c) => {
  if (!result.success) {
    return c.json({ errorMsg: result.error.flatten().fieldErrors }, 422);
  }
});
export type CallbackValidator = ExtractDetails<Parameters<typeof callbackValidator>['0']>;

export type GoogleUserValidation = z.infer<typeof googleUserValidationSchema>;
export type GithubUserValidation = z.infer<typeof githubUserValidationSchema>;
