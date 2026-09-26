import type { NextAuthConfig } from "next-auth";
import { createHash } from "crypto";
import { getUserProfile } from "@/lib/graphql/queries/profile";
import { logProfileEvent } from "@/lib/wp";

// Kept out of auth.ts so the callbacks can be tested without loading next-auth,
// which only resolves inside the Next.js runtime.

interface AppToken {
  email?: string | null;
  picture?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
  [key: string]: unknown;
}

export const callbacks = {
  async jwt({ token, trigger }) {
    const t = token as AppToken;

    if (t.email && (trigger === "signIn" || trigger === "signUp" || trigger === "update")) {
      const hash = createHash("sha256").update(t.email.toLowerCase().trim()).digest("hex");

      // undefined = WordPress failed; null = WordPress answered that there is no profile.
      const profile = await getUserProfile(hash).catch((err) => {
        console.error("[auth] getUserProfile failed, keeping cached profile:", err);
        return undefined;
      });

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

      if (profile !== undefined) {
        t.displayName = profile?.displayName ?? null;
        t.avatarUrl = profile?.avatarUrl ?? null;
      }
    }

    return t;
  },
  session({ session, token }) {
    const t = token as AppToken;
    if (session.user) {
      session.user.displayName = t.displayName ?? null;
      session.user.avatarUrl = t.avatarUrl ?? null;
    }
    return session;
  },
} satisfies NextAuthConfig["callbacks"];
