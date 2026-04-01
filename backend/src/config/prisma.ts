import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env";

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

/* ================= SOFT DELETE MIDDLEWARE ================= */

(prisma as any).$use(async (params: any, next: any) => {
  const softDeleteModels = ["Blog", "Comment"];

  // Skip if model doesn't support soft delete
  if (!params.model || !softDeleteModels.includes(params.model)) {
    return next(params);
  }

  // 🔹 READ OPERATIONS
  if (
    params.action === "findMany" ||
    params.action === "findFirst"
  ) {
    params.args = params.args || {};
    params.args.where = {
      ...params.args.where,
      deletedAt: null,
    };
  }

  // 🔹 findUnique → convert to findFirst
  if (params.action === "findUnique") {
    params.action = "findFirst";
    params.args.where = {
      ...params.args.where,
      deletedAt: null,
    };
  }

  // 🔹 DELETE → SOFT DELETE
  if (params.action === "delete") {
    params.action = "update";
    params.args.data = {
      deletedAt: new Date(),
    };
  }

  // 🔹 DELETE MANY → SOFT DELETE
  if (params.action === "deleteMany") {
    params.action = "updateMany";
    params.args.data = {
      deletedAt: new Date(),
    };
  }

  return next(params);
});