import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from '@prisma/client';

const { PrismaClient } = pkg;
const { Pool } = pg;

console.log("URL:", process.env.DATABASE_URL);

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function test() {
    try {
        const users = await prisma.account.findMany();
        console.log("Connected successfully via PrismaPg!");
    } catch (e) {
        console.error("Prisma Error:", e);
    }
}
test();
