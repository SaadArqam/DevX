import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL!;

// Create pg pool
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // REQUIRED for Render
  },
});

// Create adapter
const adapter = new PrismaPg(pool);

// Prisma client with adapter
export const prisma = new PrismaClient({
  adapter,
  log: ["error", "warn"],
});