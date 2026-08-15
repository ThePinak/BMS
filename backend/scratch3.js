import { z } from 'zod';
const schema = z.object({
  name: z.string().min(3, "Too short"),
  email: z.string().email(),
  balance: z.number().min(0)
});
const result = schema.safeParse({ name: "R" });
console.log(result.error?.issues[0]?.message);
