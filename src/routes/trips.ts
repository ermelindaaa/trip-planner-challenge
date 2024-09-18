import { Router, Request, Response } from "express";
import { getTrips } from '../services/tripsService'; 

const router = Router();

router.get('/', async(req:Request, res: Response) => {
    const {origin, destination, sort_by } = req.query;

    if(!origin || !destination) 
    { 
        return res.status(400).json({error: 'Missing parameters'});
    }

    try {
        const trips = await getTrips(origin as string, destination as string, sort_by as string);
        res.json(trips);
    }
    catch (error) {
        res.status(500).json({error: 'Failed to fetch trips'}); 
    }

}); 

export default router; 