// Task:
// 1. Import zod.
// 2. Create a schema for account creation.
// 3. Validate name, email, and optional balance.
// 4. Export the schema.
// 5. Keep balance default-friendly and prevent negative values.

import zod from 'zod';

const accountCreationSchema = zod.object({
    name: zod.string({ required_error: "Name is required" }).min(3,"Name must be at least 3 characters long"),
    email: zod.string({required_error: "Email is required" }).email(),
    balance: zod.number({required_error: "Balance is required" }).min(0, "Balance cannot be negative").optional().default(0)
})

export default accountCreationSchema;