import dotenv from "dotenv";
import { envSchema } from "../schemas/envSchema";
import { z } from "zod";

dotenv.config();

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
