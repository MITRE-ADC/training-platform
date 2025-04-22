import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./schema";

export const client = new Client({
  host: "localhost",
  port: 5432,
  user: "mitre_admin",
  password: "changeme",
  database: "mitre_db",
});

async function connectDB() {
  try {
    await client.connect();
  } catch (error) {
    console.error("FAILED TO CONNECT TO DATABASE", error);
  }
}

export const db = drizzle(client, { schema });
connectDB();
