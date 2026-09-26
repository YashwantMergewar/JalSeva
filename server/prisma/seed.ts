import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined. Add it to your .env file.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.role.createMany({
    data: [
      {
        name: "ENGINEER",
        description: "Manages water supply operations, schedules, complaints, and field activities."
      },
      {
        name: "SENIOR_CLERK",
        description: "Handles administrative processing, complaints, service applications, and reports."
      },
      {
        name: "JUNIOR_CLERK",
        description: "Handles complaint registration, service applications, and administrative support."
      },
      {
        name: "PLUMBER",
        description: "Handles water dispatch, field visits, repairs, and complaint resolution."
      }
    ],
    skipDuplicates: true
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });