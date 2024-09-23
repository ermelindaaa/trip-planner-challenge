import { Router, Request, Response } from 'express';
import { searchTrips, saveTrip, listTrips, deleteTrip } from '../services/tripsService';
import { validateParams } from '../utils/validateParams';

const router = Router();

// Search trips 
router.get('/trips', async (req: Request, res: Response) => {
  const { origin, destination, sort_by } = req.query;

  // Check if the origin and destination are valid
  const errorMessage = validateParams(origin as string, destination as string);
  if (errorMessage) return res.status(400).json({ error: errorMessage });

  try {
    const trips = await searchTrips(origin as string, destination as string, sort_by as string);
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

// Save a trip
router.post('/trip', async (req: Request, res: Response) => {
  try {
    const trip = await saveTrip(req.body);
    res.status(201).json({ message: 'Trip saved to the database', trip });
  } catch (error) {
    res.status(500).send('Error saving trip: ' + error);
  }
});

// List all saved trips
router.get('/savedTrips', async (req: Request, res: Response) => {
  try {
    const trips = await listTrips();
    res.json(trips);
  } catch (error) {
    res.status(500).send('Error retrieving trips: ' + error);
  }
});

// Delete a trip
router.delete('/trip/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deleteTrip(id);
    res.send('Trip deleted successfully');
  } catch (error) {
    res.status(500).send('Error deleting trip: ' + error);
  }
});

export default router;
