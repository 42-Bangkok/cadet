import { roles, users, usersToRoles } from "@/drizzle/schemas";
import { db } from "@/lib/db/clients";
import { eq } from "drizzle-orm";

const ROLES = [
  {
    name: "staff",
    description: "42 Bangkok staff",
  },
  {
    name: "tutor",
    description: "Tutor member",
  },
];

async function seedRoles() {
  console.log("Seeding roles...");
  await db.insert(roles).values(ROLES).onConflictDoNothing();
  console.log("Roles seeded.");
}

/**
 * Seeds the db with initial staffs.
 */
async function seedStaffs() {
  console.log("Seeding staffs...");
  const user = await db.query.users.findFirst({
    where: eq(users.email, "pumidol.le@kmitl.ac.th"),
  });
  if (!user) {
    console.log("User not found.");
    return;
  }
  const staffRole = await db.query.roles.findFirst({
    where: eq(roles.name, "staff"),
  });
  await db
    .insert(usersToRoles)
    .values({
      userId: user.id,
      roleId: staffRole!.id,
    })
    .onConflictDoNothing();
  console.log("Staffs seeded.");
}

await seedRoles();
await seedStaffs();
process.exit(0);
