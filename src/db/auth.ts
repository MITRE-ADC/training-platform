import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./index";
import { eq } from "drizzle-orm";
import { accounts, users } from "./schema";

async function getUserFromDb(email: string) {
  // const user = await db
  //   .select()
  //   .from(users)
  //   .where(eq(users.email, email));
  // return user;

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  return user;
}

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   adapter: DrizzleAdapter(db, {
//     usersTable: users,
//     accountsTable: accounts,
//   }),
//   providers: [],
// });

export const {
  handler,
  signIn,
  signOut,
  auth,
} = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@gmail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        let user = null;

        if (credentials == undefined) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        if (!email || !password) {
          return null;
        }

        user = await getUserFromDb(email);

        if (user) {

          if (!user.pass) {
            return null;
          }

          const isAuthenciated = user.pass = password;
          if (isAuthenciated) {
            return user;
          } else {
            return null;
          }
        }

        if (!user) {
          return null;
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: '/signin',
  }
});

