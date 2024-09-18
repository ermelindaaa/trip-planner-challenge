import axios from 'axios'; 
import dotenv from 'dotenv';

dotenv.config();

interface Trip {
    origin: string; 
    destination: string; 
    cost: number; 
    duration: number; 
    type: string; 
    id: string;
    display_name: string;
}

const API_URL = 'https://z0qw1e7jpd.execute-api.eu-west-1.amazonaws.com/default/trips';
const API_KEY = process.env.API_KEY;

export const getTrips = async (origin: string, destination: string, sort_by: string): Promise<Trip[]> => {
    console.log(origin)
    console.log(destination)
    console.log(sort_by)
    console.log(API_KEY)

    try { 
        console.log("Hererrerer 1")
        const response = await axios.get<Trip[]>(API_URL, {
            headers: { 'x-api-key': API_KEY },
            params: { origin, destination, sort_by }
        });
        console.log('API response:', response); 


        // filter trips by origin and destination
        const filteredTrips = response.data.filter(trip => 
            trip.origin === origin && trip.destination === destination
        );

        // sort by fastest or cheapest 
        if(sort_by === 'fastest') 
        {
            filteredTrips.sort((a,b) => a.duration - b.duration);
        }
        else if (sort_by === 'cheapest') 
        {
            filteredTrips.sort((a,b) => a.cost - b.cost); 
        }

        return filteredTrips;
    }
    catch (error) {
        throw new Error('Error fetching trips'); 
    }
}; 