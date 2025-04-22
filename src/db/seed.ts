import { db } from "@/db/index";
import { users } from "@/db/schema";

await db.insert(users).values([
  {
    name: "Administrator",
    email: "admin@mitre.domain.com",
    pass: "changeme",
    webgoatusername: "Administrator",
    webgoatpassword: "changeme",
  },
]);

process.exit(0);
