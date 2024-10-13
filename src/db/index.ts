import 'dotenv/config';
import { drizzle } from 'drizzle-orm/connect';
import { usersTable } from './schema';

export const connect = async () => await drizzle("node-postgres", process.env.DATABASE_URL!);

async function main() {
    const db = await connect();

    const user: typeof usersTable.$inferInsert = {
        first_name: 'administrator',
        last_name: 'administrator',
        email: 'admin@mitre.email.domain.com'
    }

    // TEMP
    console.log("Creating users table");
    await db.insert(usersTable).values(user);
}

// TEMP
main();


