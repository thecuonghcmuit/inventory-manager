import { PrismaClient } from "@prisma/client";

// Reuse one client across dev hot reloads; each reload would otherwise
// create a new PrismaClient and open another connection pool.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
