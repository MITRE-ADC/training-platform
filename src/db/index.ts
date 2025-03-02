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

// export const connectDB = async () => await client.connect();
// export const db = drizzle(client, { schema });

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to the database successfully");
  } catch (error) {
    console.log("FAILED TO CONNECT TO DATABASE", error);
  }
}

export const db = drizzle(client, { schema });
connectDB();
