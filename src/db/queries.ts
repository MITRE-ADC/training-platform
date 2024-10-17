import { eq } from "drizzle-orm";
import { db } from "./index";
import { users, User } from "./schema";

// Fetch all users
export async function getAllUsers() {
  return await db.select().from(users);
}

// Add a new user
export async function addUser(user: User) {
  return await db.insert(users).values([user]);
}

// Update a user
export async function updateUser(user: User) {
  return await db.update(users).set(user).where(eq(users.id, user.id));
}

// Delete a user
export async function deleteUser(id: number) {
  return await db.delete(users).where(eq(users.id, id));
}
