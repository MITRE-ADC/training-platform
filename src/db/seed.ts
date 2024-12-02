// https://loclv.hashnode.dev/use-drizzle-orm-ver-029-and-postgresjs-step-by-step-with-bun

import { db } from "@/db/index";
import { users } from "@/db/schema";

await db.insert(users).values([
  {
    name: "Administrator",
    email: "admin@mitre.domain.com",
    pass: "changeme",
    webgoatusername: "Administrator", // make sure you actually sign up in webgoat if you use this seeded data
    webgoatpassword: "changeme",
  },
]);

console.log("Seeding complete. ");

// DONE
process.exit(0);
