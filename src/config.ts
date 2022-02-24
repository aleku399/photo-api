import * as dotenv from "dotenv-safe";
import pino from "pino";
import expressPino from "express-pino-logger";
import isCI from "is-ci";
import { v2 as cloudinary } from "cloudinary";

export interface Result {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  url: string;
  secure_url: string;
}

const dotenvConfig = isCI ? { path: ".env.test" } : {};

dotenv.config(dotenvConfig);

export const logger = pino({ level: process.env.LOG_LEVEL || "info" });

export const port = process.env.PORT || 4001;

export const secret = process.env.APP_SECRET || "secret";

export const enableQueryLogging: boolean =
  (process.env.ENABLE_QUERY_LOGGING || "true") === "true";
export const arenaPort: number = +process.env.ARENA_PORT || 4545;
export const redisHost: string = process.env.REDIS_HOST || "localhost";
export const redisPort: number = +process.env.REDIS_PORT || 6379;

export const queueConfig = {
  defaultJobOptions: {
    attempts: 5
  },
  connection: { host: redisHost, port: redisPort }
};

export type Environment = "production" | "test" | "development";

const environment = process.env.NODE_ENV as Environment;

export function safeEnvironment(): Environment {
  if (
    environment === "test" ||
    environment === "production" ||
    environment === "development"
  ) {
    return environment;
  }
  logger.error(
    `Invalid environment variable provided ${environment} : Defaulting to development`
  );
  return "development";
}

export const expressLogger = expressPino({ logger });

export const corsOptions = {
  exposedHeaders: ["Content-Range"]
};

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

export const cloudinaryConfig = (file: string): Promise<unknown> => {
  return new Promise(resolve => {
    cloudinary.uploader.upload(
      file,
      { resource_type: "auto" },
      (_err, result: Result) => {
        resolve(result.url);
      }
    );
  });
};
