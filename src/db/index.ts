import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

const client = new Client({
  host: "localhost",
  port: 5432,
  user: "mitre_admin",
  password: "changeme",
  database: "mitre_db",
});

export const connectDB = async () => await client.connect();

export const db = drizzle(client);

connectDB();
