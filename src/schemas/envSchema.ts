import { z } from "zod";

export const envSchema = z.object({
  API_URL: z.string().url(),
  API_KEY: z.string().min(1, "API_KEY is required"),
  PORT: z.string().min(1, "PORT is required").transform(Number),
  DB_NAME: z.string().min(1, "DB_NAME is required"),
  DB_USER: z.string().min(1, "DB_USER is required"),
  DB_PASS: z.string().min(1, "DB_PASS is required"),
  DB_HOST: z.string().min(1, "DB_HOST is required"),
});
