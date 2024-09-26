import exp from "constants";
import { z } from "zod";

// zod schema for trip response validation
const TripSchema = z.object({
  origin: z.string(),
  destination: z.string(),
  cost: z.number(),
  duration: z.number(),
  type: z.string(),
  id: z.string(),
  display_name: z.string(),
});

export { TripSchema };
