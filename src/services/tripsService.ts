import axiosInstance from '../axiosInstances'; 
import axios from 'axios';
import Trip from '../models/Trip';
import TripSchema from "../schemas/TripSchema";
import dotenv from 'dotenv';
import { z } from 'zod';
import { env } from '../schemas/envSchema'; 


export const searchTrips = async (origin: string, destination: string, sort_by?: string) => {
  try {
    console.log('heree ')
    const response = await axios.get(env.API_URL, {
      headers: { 'x-api-key': env.API_KEY },
      params: { origin, destination, sort_by }
    });
    
    console.log(response)

    // const trips = z.array(tripSchema).parse(JSON.parse(response.data))
    const trips = z.array(TripSchema).parse(response.data); 
    // const trips = response.data;  

    // console.log('Response Data:', response.data);
    // validate trip request
    const filteredTrips = trips.filter(trip => trip.origin === origin && trip.destination === destination);

    // sort trips by fastest(duration) and cheapest(cost)
    if (sort_by === 'fastest') {
      filteredTrips.sort((a, b) => a.duration - b.duration);
    } else if (sort_by === 'cheapest') {
      filteredTrips.sort((a, b) => a.cost - b.cost);
    }

    return filteredTrips;
  } catch (error) {
    throw new Error('Error fetching trips: ' + error);
  }
};

// search if trip already exists on database and save new ones
export const saveTrip = async (tripData: object) => {
  try {
    const parsedTripData = TripSchema.parse(tripData)

    const existingTrip = await Trip.findOne({
      where: {
        id: parsedTripData.id,
        deleted: false,
      },
    })

    if (existingTrip) {
      throw new Error('This trip aleardy exists on saved trips.');
    }

    const trip = await Trip.create(parsedTripData);
    console.log('Trip saved to the database');
    return trip;
  } catch (error) {
    throw new Error('Error saving trip: ' + error);
  }
};

// list all saved trips (removed deleted ones)
export const listTrips = async () => {
  try {
    const trips = await Trip.findAll({
      where: {
        deleted: false,
      }
    });

    if(trips.length === 0) {
      return [];
    }
    return trips;
  } catch (error) {
    throw new Error('Error retrieving trips: ' + error);
  }

};

//delete trip by id
export const deleteTrip = async (id: string) => {
  try {
    const result = await Trip.update({ deleted: true },{ where: { id } });
    if (result[0] === 0) throw new Error('Trip not found');
  } catch (error) {
    throw new Error('Error deleting trip: ' + error);
  }
};
