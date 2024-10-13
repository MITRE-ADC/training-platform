import 'dotenv/config';
import { drizzle } from 'drizzle-orm/connect';
import { usersTable } from './schema';


async function main() {
    const db = await drizzle("node-postgres", process.env.DATABASE_URL!);

    const user: typeof usersTable.$inferInsert = {
        first_name: 'administrator',
        last_name: 'administrator',
        email: 'admin@mitre.email.domain.com'
    }

    console.log("Creating users table");
    await db.insert(usersTable).values(user);
}

// TEMP
main();


