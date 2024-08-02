import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({
  path: "./.env",
});

export const env = z
  .object({
    MONGO_URL: z.string(),
    EMAIL: z.string(),
    POSTMARK_SECRET: z.string(),
    PASSWORD: z.string(),
}).parse(process.env);
