import NextAuth, { type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import { createHash } from "crypto";
import { getUserProfile } from "@/lib/graphql/queries/profile";

// Extend built-in session type to expose our custom field
declare module "next-auth" {
  interface Session {
    user: { displayName: string | null } & DefaultSession["user"];
  }
}

// Token shape with our custom field (Auth.js v5 doesn't export next-auth/jwt for augmentation)
interface AppToken {
  email?: string | null;
  displayName?: string | null;
  [key: string]: unknown;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, trigger }) {
      const t = token as AppToken;
      // Fetch custom displayName on sign-in and on explicit session.update()
      // Normal session reads (trigger === undefined) use the cached token value
      if (t.email && (trigger === "signIn" || trigger === "signUp" || trigger === "update")) {
        const hash = createHash("sha256")
          .update(t.email.toLowerCase().trim())
          .digest("hex");
        const profile = await getUserProfile(hash).catch(() => null);
        t.displayName = profile?.displayName ?? null;
      }
      return t;
    },
    session({ session, token }) {
      const t = token as AppToken;
      if (session.user) {
        session.user.displayName = t.displayName ?? null;
      }
      return session;
    },
  },
});
