import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env";
import logger from "../utils/logger";

const connectionString = `${env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
  log: [
    { level: "info", emit: "stdout" },
    { level: "warn", emit: "stdout" },
    { level: "error", emit: "stdout" },
  ],
});

/* ================= SOFT DELETE READ FILTERING ================= */
// Deprecated: prisma.$use logic has been moved to the Service layer 
// (e.g. BlogService, CommentService) where deletedAt: null is explicitly checked.
// High-performance filtering can be implemented using Prisma Extensions if needed.


prisma.$connect()
  .then(() => logger.info("Prisma connected to Database"))
  .catch((err) => logger.error("Prisma connection failed", err));