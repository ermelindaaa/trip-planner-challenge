import dotenv from "dotenv";
import { envSchema } from "../schemas/envSchema";
import { z } from "zod";

dotenv.config();

// load and validate environment variables using dotenv and zod schema validation
declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}

export const loadEnv = async () => {
  try {
    envSchema.parse(process.env);
    // console.log(process.env);
  } catch (error) {
    throw new Error("Error reading env variables");
  }
};
