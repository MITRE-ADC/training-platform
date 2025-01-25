import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./schema";

export const client = new Client({
  host: "postgres_db",
  port: 5432,
  user: "mitre_admin",
  password: "changeme",
  database: "mitre_db",
});

export const connectDB = async () => await client.connect();

export const db = drizzle(client, { schema });

connectDB();
