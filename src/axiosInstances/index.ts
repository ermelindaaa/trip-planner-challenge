import axios from "axios";
import logger from "../logger/logger";
import dotenv from "dotenv";
dotenv.config();

// create axios instance
const axiosInstance = axios.create({
  baseURL: process.env.API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers["x-api-key"] = process.env.API_KEY;
    return config;
  },
  (error) => {
    logger.error("Axios request error:", error);
    return Promise.reject(error);
  },
);

export { axiosInstance };
