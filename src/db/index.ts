import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./schema";

export const client = new Client({
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT || "5432"),
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
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
