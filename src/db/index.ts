import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

export const client = new Client({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "root",
  database: "tutorial-db",
});

export const connectDB = async () => await client.connect();

export const db = drizzle(client);

connectDB();
