import NextAuth, { type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import { createHash } from "crypto";
import { getUserProfile } from "@/lib/graphql/queries/profile";
import { logProfileEvent } from "@/lib/wp";

declare module "next-auth" {
  interface Session {
    user: { displayName: string | null } & DefaultSession["user"];
  }
}

interface AppToken {
  email?: string | null;
  picture?: string | null;
  displayName?: string | null;
  [key: string]: unknown;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, trigger }) {
      const t = token as AppToken;

      if (t.email && (trigger === "signIn" || trigger === "signUp" || trigger === "update")) {
        const hash = createHash("sha256")
          .update(t.email.toLowerCase().trim())
          .digest("hex");

        const profile = await getUserProfile(hash).catch(() => null);

        // On login: record event + seed email/avatar via the PHP endpoint.
        // The endpoint handles profile creation, private email storage, avatar seed
        // (only if no avatar exists), and audit log — all in one authenticated call.
        if ((trigger === "signIn" || trigger === "signUp") && t.picture) {
          await logProfileEvent({
            hash,
            event: "login",
            email: t.email ?? undefined,
            avatar_url: t.picture,
          });
        }

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
