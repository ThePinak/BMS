// Task:
// 1. Import zod.
// 2. Create a schema for account creation.
// 3. Validate name, email, and optional balance.
// 4. Export the schema.
// 5. Keep balance default-friendly and prevent negative values.

import { z } from "zod";

export const createAccountSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Valid email is required"),
  balance: z.number().min(0, "Balance cannot be negative").optional().default(0)
});

export const accountIdParamSchema = z.object({
  id: z.string().uuid("Valid account id is required")
});