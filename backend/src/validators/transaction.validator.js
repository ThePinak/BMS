// Task:
// 1. Import zod.
// 2. Create schema for deposit and withdraw body.
// 3. Create schema for transfer body.
// 4. Keep amount required and positive.
// 5. Export all schemas.

// Schemas needed:
// amountSchema
// amount: number, positive
// transferSchema
// fromAccountId: string, uuid
// toAccountId: string, uuid
// amount: number, positive
// Optional:
// allow description later, but not required now

import z from "zod";

export const amountSchema = z.object({
    amount: z.number().positive(),
});

export const transferSchema = z.object({
    toAccountId: z.string().uuid("Valid destination account id is required"),
    amount: z.number().positive("Amount must be positive")
});
