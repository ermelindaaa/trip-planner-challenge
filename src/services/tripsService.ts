import { axiosInstance } from "../axiosInstances";
import Trip from "../models/Trip";
import { TripSchema } from "../schemas/TripSchema";
import { z } from "zod";
import { ClientError } from "../errors/ClientError";
import logger from "../logger/logger";

// search trips and sort them by fastest or cheapest (as well added type filter in query params)
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

    if (type) {
      filteredTrips = filteredTrips.filter((trip) => trip.type === type);
    }

    return filteredTrips;
  } catch (error) {
    throw new ClientError("ErrorFetchingTrips", "Error fetching trips.");
  }
};

// search if trip already exists on database and save new ones
export const saveTrip = async (tripData: object) => {
  try {
    const parsedTripData = TripSchema.parse(tripData);

    const existingTrip = await Trip.findOne({
      where: {
        id: parsedTripData.id,
        // deleted: false,
      },
    });

    if (existingTrip) {
      if (existingTrip.deleted) {
        // Restore and update the deleted trip
        await existingTrip.update({ ...parsedTripData, deleted: false });
        logger.info(`Deleted trip with id ${parsedTripData.id} has been restored and updated.`);
        const restoredTrip = await Trip.findOne({
          where: { id: parsedTripData.id },
          attributes: { exclude: ['deleted'] }, // Exclude `deleted`
        });
        return restoredTrip;
        // return existingTrip;
      } else {
        throw new ClientError("TripExistsError", "This trip already exists.");
      }
    }

    // Create a new trip if none exists
    const trip = await Trip.create(parsedTripData);
    logger.info(`Trip with id ${parsedTripData.id} saved to the database.`);
    const newTrip = await Trip.findOne({
      where: { id: trip.id },
      attributes: { exclude: ['deleted'] }, // Exclude `deleted`
    });
    return newTrip;
  } catch (error) {
    throw new ClientError("SaveTripError", "Error saving trip.");
  }
};

// list all saved trips (removed deleted ones)
export const listTrips = async () => {
  try {
    const trips = await Trip.findAll({
      where: {
        deleted: false,
      },
      attributes: { exclude: ['deleted'] },
    });

    return trips;
  } catch (error) {
    throw new ClientError("RetrivingTripsError", "Error retrieving trips.");
  }
};

//delete trip by id
export const deleteTrip = async (id: string) => {
  try {

    const result = await Trip.update({ deleted: true },{ where: { id } });


    if (result[0] === 0) {
      throw new ClientError ("TripNotFound", "Trip not found")
    }
    const trip = await Trip.findOne({ where: { id }, 
      attributes: { exclude: ['deleted'] }, })
    return trip 
  } catch (error) {
    throw new Error("Error deleting trip: " + error);
  }
};
