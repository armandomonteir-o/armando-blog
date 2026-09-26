import NextAuth, { type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import { callbacks } from "@/lib/auth/callbacks";

declare module "next-auth" {
  interface Session {
    user: { displayName: string | null; avatarUrl: string | null } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  pages: { signIn: "/login" },
  callbacks,
});
