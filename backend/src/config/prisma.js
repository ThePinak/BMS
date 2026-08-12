// Task:
// 1. Import PrismaClient from @prisma/client.
// 2. Create one Prisma client instance.
// 3. Export that instance.
// 4. This file will be reused by services and repositories later.
import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from '@prisma/client';

const { PrismaClient } = pkg;
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg({ pool });
const prisma = new PrismaClient({ adapter });

export default prisma;
