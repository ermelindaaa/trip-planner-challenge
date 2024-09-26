import { createLogger, format, transports } from "winston";
import dotenv from "dotenv";
dotenv.config();

const logger = createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "error",
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return JSON.stringify({
        timestamp: timestamp,
        level: level,
        message: message,
      });
    })
  ),
  transports: [new transports.Console()],
});

export default logger;
