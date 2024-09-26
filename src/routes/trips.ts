import { Router, Request, Response } from "express";
import { z } from "zod";
import logger from "../logger/logger";
import { ClientError } from "../errors/ClientError";
import {
  searchTrips,
  saveTrip,
  listTrips,
  deleteTrip,
} from "../services/tripsService";
import { QueryParamsSchema } from "../schemas/QueryParamsSchema";

const tripsRouter = Router();

// search trips
tripsRouter.get("/trips", async (req: Request, res: Response) => {
  try {
    const queryParams = QueryParamsSchema.parse(req.query);
    // console.log(queryParams);
    const trips = await searchTrips(
      queryParams.origin,
      queryParams.destination,
      queryParams.sort_by,
      queryParams.type,
    );
    // console.log(trips);
    res.json(trips);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        path: err.path,
        message: err.message,
        code: err.code,
      }));
      return res
        .status(400)
        .json({ name: error.name, errors: formattedErrors });
    }

    logger.error("Failed to fetch trips:", error);
    return res
      .status(500)
      .json({ name: "InternalServerError", message: "Something went wrong" });
  }
});

// save a trip
tripsRouter.post("/trip", async (req: Request, res: Response) => {
  try {
    const trip = await saveTrip(req.body);
    res.status(201).json(trip);
  } catch (error) {
    if (error instanceof ClientError) {
      return res.status(400).json({ name: error.name, message: error.message });
    }

    logger.error("Error saving trip:", error);
    return res
      .status(500)
      .json({ name: "InternalServerError", message: "Something went wrong" });
  }
});

// list all saved trips
tripsRouter.get("/savedTrips", async (req: Request, res: Response) => {
  try {
    const trips = await listTrips();
    res.json(trips);
  } catch (error) {
    if (error instanceof ClientError) {
      return res.status(400).json({ name: error.name, message: error.message });
    }

    logger.error("Error saving trip:", error);
    return res
      .status(500)
      .json({ name: "InternalServerError", message: "Something went wrong" });
  }
});

// delete a trip
tripsRouter.delete("/trip/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedTrip = await deleteTrip(id);
    res.status(200).json(deletedTrip);
  } catch (error) {
    if (error instanceof ClientError) {
      return res.status(400).json({ name: error.name, message: error.message });
    }

    logger.error("Error deleting trip:", error);
    return res
      .status(500)
      .json({ name: "InternalServerError", message: "Something went wrong" });
  }
});

export default tripsRouter;
