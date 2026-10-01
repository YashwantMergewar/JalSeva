import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient } from "../../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined. Add it to your .env file.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.INITIAL_ADMIN_EMAIL;
  const password_hash = process.env.INITIAL_ADMIN_PASSWORD;
  const fullname = process.env.INITIAL_ADMIN_NAME;

  if (!email || !password_hash || !fullname) {
    throw new Error("Missing initial admin configuration");
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log("Initial admin already exists.");
    return;
  }

  const adminRole = await prisma.role.findFirst({
    where: { name: "ADMIN" },
  });

  if (!adminRole) {
    throw new Error("Admin role has not been seeded.");
  }

  const hashedPassword = await bcrypt.hash(password_hash, 12);

  await prisma.user.create({
    data: {
      fullname,
      mobile_no: process.env.INITIAL_ADMIN_MOBILE || "9999999999",
      email,
      password_hash: hashedPassword,
      userType: "EMPLOYEE",
      roleId: adminRole.id,
    },
  });

  console.log("Initial admin created successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });