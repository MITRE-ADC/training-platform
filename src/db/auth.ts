import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./index";
import { getUserByEmail } from "./queries";

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

        console.log(req.body ?? "no body")
        if (credentials == undefined) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        if (!email || !password) {
          return null;
        }

        user = await getUserByEmail(email);

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

