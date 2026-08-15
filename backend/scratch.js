import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;
console.log("URL:", process.env.DATABASE_URL);

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function test() {
    try {
        const client = await pool.connect();
        console.log("Connected successfully to pg!");
        client.release();
    } catch (e) {
        console.error("PG Pool Error:", e.message);
    }
}
test();
