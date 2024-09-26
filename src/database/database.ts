import { Sequelize } from "sequelize";
import logger from "../logger/logger";
import dotenv from "dotenv";
dotenv.config();

// initialize sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging:
      process.env.NODE_ENV === "development"
        ? (msg) => logger.info(msg)
        : false,
  },
);
export default sequelize;
