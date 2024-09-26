import express from "express";
import dotenv from "dotenv";
import tripRoutes from "./routes/trips";
import sequelize from "./database/database";
import logger from "./logger/logger";
import { loadEnv } from "./utils/loadEnv";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api", tripRoutes);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, async () => {
  loadEnv();
  logger.info(`App is listening on port ${PORT}`);
  try {
    await sequelize.authenticate();
    logger.info("Connected to db!");
    await sequelize.sync({ alter: true });
    // await sequelize.sync({ force: true });
  } catch (e) {
    logger.debug(e);
    throw new Error("Failed to connect to the database");
  }
});
