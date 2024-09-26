import { axiosInstance } from "../axiosInstances";
import Trip from "../models/Trip";
import { TripSchema } from "../schemas/TripSchema";
import { z } from "zod";
import { ClientError } from "../errors/ClientError";
import logger from "../logger/logger";

// search trips and sort them by fastest or cheapest
export const searchTrips = async (
  origin: string,
  destination: string,
  sort_by?: string,
  type?: string,
) => {
  try {
    const response = await axiosInstance.get("/default/trips", {
      params: { origin, destination, sort_by, type },
    });

    const trips = z.array(TripSchema).parse(response.data);

    let filteredTrips = trips.filter(
      (trip) => trip.origin === origin && trip.destination === destination,
    );

    // sort trips by fastest(duration) and cheapest(cost)
    if (sort_by === "fastest") {
      filteredTrips.sort((a, b) => a.duration - b.duration);
    } else if (sort_by === "cheapest") {
      filteredTrips.sort((a, b) => a.cost - b.cost);
    }

    // option to filter trips by type
    if (type) {
      filteredTrips = filteredTrips.filter((trip) => trip.type === type);
    }

    return filteredTrips;
  } catch (error) {
    logger.error(error);
    throw new ClientError("ErrorFetchingTrips", "Error fetching trips.");
  }
};

// save a trip
export const saveTrip = async (tripData: object) => {
  const parsedTripData = TripSchema.parse(tripData);

  // Check if the trip already exists (including deleted ones)
  const existingTrip = await Trip.findOne({
    where: { id: parsedTripData.id },
  });

  if (existingTrip && existingTrip.deleted) {
    await existingTrip.update({ ...parsedTripData, deleted: false });
    logger.info(
      `Deleted trip with ID ${parsedTripData.id} has been restored and updated.`,
    );
    return existingTrip;
  } else if (existingTrip && !existingTrip.deleted) {
    throw new ClientError("TripExistsError", "This trip already exists.");
  } else {
    const newTrip = await Trip.create(parsedTripData);
    logger.info(`Trip with id ${parsedTripData.id} saved to the database.`);
    return newTrip;
  }
};

// list all saved trips
export const listTrips = async () => {
  try {
    const trips = await Trip.findAll({
      where: {
        deleted: false,
      },
    });

    return trips;
  } catch (error) {
    logger.error("Error retrieving trips: " + error);
    throw new ClientError("RetrivingTripsError", "Error retrieving trips.");
  }
};

//delete trip by id
export const deleteTrip = async (id: string) => {
  const trip = await Trip.findOne({
    where: { id },
  });
  if (!trip || trip.deleted) {
    throw new ClientError("TripNotFound", "Trip not found");
  }
  await trip.update({ deleted: true });
  logger.info(`Trip with ID ${id} has been deleted.`);
  return trip;
};
