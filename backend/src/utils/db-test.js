// Task:
// 1. Import the Prisma client from config/prisma.js.
// 2. Try to connect to the database.
// 3. Print a success message if connection works.
// 4. Print the error if connection fails.
// 5. Disconnect Prisma in finally block.

import "../config/env.js";
import prisma from "../config/prisma.js";

async function testDB() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testDB();
    