import { z } from "zod";

// validation of query parameters
const QueryParamsSchema = z.object({
  origin: z
    .string()
    .min(3, "Origin is required")
    .max(3, "Origin must be a 3-letter code")
    .toUpperCase(),
  destination: z
    .string()
    .min(3, "Destination is required")
    .max(3, "Destination must be a 3-letter code")
    .toUpperCase(),
  sort_by: z.enum(["fastest", "cheapest"]).optional(),
  type: z.enum(["car", "flight", "train"]).optional(),
});

export { QueryParamsSchema };
