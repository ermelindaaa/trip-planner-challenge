import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { searchTrips, saveTrip, listTrips, deleteTrip } from '../services/tripsService';

const router = Router();

// validate query params 
const queryParamsSchema = z.object({
  origin: z.string().min(3).max(3).regex(/^[A-Z]{3}$/, 'Origin must be a 3-letter code').transform(str => str.toUpperCase()),
  destination: z.string().min(3).max(3).regex(/^[A-Z]{3}$/, 'Destination must be a 3-letter code').transform(str => str.toUpperCase()),
  sort_by: z.enum(['fastest', 'cheapest']).optional()
});

// search trips 
router.get('/trips', async (req: Request, res: Response) => {
  try {
    const queryParams = queryParamsSchema.parse(req.query); // Validate query params with Zod

    console.log(queryParams)
    const trips = await searchTrips(queryParams.origin, queryParams.destination, queryParams.sort_by);
    console.log(trips)
    res.json(trips);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).send('Failed to fetch trips: ' + (error as Error).message);
  }
});

// save a trip
router.post('/trip', async (req: Request, res: Response) => {
  try {
    const trip = await saveTrip(req.body); 
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).send('Error saving trip: ' + error);
  }
});

// list all saved trips
router.get('/savedTrips', async (req: Request, res: Response) => {
  try {
    const trips = await listTrips();
    res.json(trips);
  } catch (error) {
    res.status(500).send('Error retrieving trips: ' + error);
  }
});

// delete a trip
router.delete('/trip/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deleteTrip(id);
    res.send({});
  } catch (error) {
    res.status(500).send('Error deleting trip: ' + error);
  }
});

export default router;
