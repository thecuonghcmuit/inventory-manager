import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Credentials come from .env (gitignored) so no password is committed to the repo.
const email = process.env.SEED_ADMIN_EMAIL;
const password = process.env.SEED_ADMIN_PASSWORD;

if (!email || !password) {
  console.error("Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env before seeding.");
  process.exit(1);
}
if (password.length < 8) {
  console.error("SEED_ADMIN_PASSWORD must be at least 8 characters.");
  process.exit(1);
}

const db = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash(password!, 12);

  const admin = {
    firstName: "Admin",
    lastName: "User",
    password: passwordHash,
    phoneNumber: "+1 555 010 0100",
    image: "https://ui-avatars.com/api/?name=Admin+User&background=9C6311&color=fff",
    role: "admin",
  };

  // Re-running resets the admin's profile and password to the values above.
  const user = await db.user.upsert({
    where: { email: email! },
    update: admin,
    create: { email: email!, ...admin },
    select: { id: true, email: true, role: true },
  });

  console.log(`Seeded admin: ${user.email} (role: ${user.role}, id: ${user.id})`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
