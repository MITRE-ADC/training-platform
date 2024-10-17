// https://loclv.hashnode.dev/use-drizzle-orm-ver-029-and-postgresjs-step-by-step-with-bun

import { db } from "@/db/index";
import { users } from "@/db/schema";

await db.insert(users).values([
  {
    first_name: "Administrator",
    last_name: "Administrator",
    email: "admin@mitre.domain.com",
  },
]);

console.log("Seeding complete. ");

// DONE
process.exit(0);
