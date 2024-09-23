import axios from 'axios';
import Trip from '../models/Trip';
import dotenv from 'dotenv';
import { InterfaceTrip } from '../interfaces/TripInterface';

dotenv.config();

const API_URL = 'https://z0qw1e7jpd.execute-api.eu-west-1.amazonaws.com/default/trips';
const API_KEY = process.env.API_KEY;

export const searchTrips = async (origin: string, destination: string, sort_by: string): Promise<InterfaceTrip[]> => {
  try {
    const response = await axios.get<InterfaceTrip[]>(API_URL, {
      headers: { 'x-api-key': API_KEY },
      params: { origin, destination, sort_by }
    });

    const filteredTrips = response.data.filter(trip => trip.origin === origin && trip.destination === destination);

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

export const saveTrip = async (tripData: any) => {
  try {
    const trip = await Trip.create(tripData);
    console.log('Trip saved to the database');
    return trip;
  } catch (error) {
    throw new Error('Error saving trip: ' + error);
  }
};

export const listTrips = async () => {
  try {
    const trips = await Trip.findAll();
    return trips;
  } catch (error) {
    throw new Error('Error retrieving trips: ' + error);
  }
};

export const deleteTrip = async (id: string) => {
  try {
    const result = await Trip.destroy({ where: { id } });
    if (result === 0) throw new Error('Trip not found');
  } catch (error) {
    throw new Error('Error deleting trip: ' + error);
  }
};
