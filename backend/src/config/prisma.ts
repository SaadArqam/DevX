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
// This middleware ensures that soft-deleted items are excluded from find operations
// but allows hard deletes if explicitly called (though services should use softDelete).

prisma.$use(async (params, next) => {
  const softDeleteModels = ["Blog", "Comment"];

  if (!params.model || !softDeleteModels.includes(params.model)) {
    return next(params);
  }

  // 🔹 READ OPERATIONS: Auto-filter deletedAt: null
  if (["findMany", "findFirst", "findUnique", "count", "aggregate"].includes(params.action)) {
    params.args = params.args || {};
    params.args.where = {
      ...params.args.where,
      deletedAt: null,
    };
    
    // Convert findUnique to findFirst to support arbitrary where filters
    if (params.action === "findUnique") {
      params.action = "findFirst";
    }
  }

  // NOTE: delete and deleteMany are NOT overridden here.
  // Explicit soft delete logic is moved to Service Layer.

  return next(params);
});

prisma.$connect()
  .then(() => logger.info("Prisma connected to Database"))
  .catch((err) => logger.error("Prisma connection failed", err));