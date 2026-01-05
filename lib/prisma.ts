import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

// Ensure DATABASE_URL is loaded in development from prisma/.env when present
if (!process.env.DATABASE_URL) {
  try {
    const envPath = path.resolve(process.cwd(), 'prisma', '.env');
    if (fs.existsSync(envPath)) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const dotenv = require('dotenv').config({ path: envPath });
      if (dotenv && dotenv.parsed) {
        process.env = { ...process.env, ...dotenv.parsed };
      }
    }
  } catch (e) {
    // ignore
  }
}

const globalForPrisma = global as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
