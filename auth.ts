import NextAuth, { type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import { createHash } from "crypto";
import { getUserProfile } from "@/lib/graphql/queries/profile";

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

// On first login, auto-create a WP user-profile with the Google photo as default avatar.
// This makes comment avatars work immediately without the user visiting /minha-conta.
async function ensureWPProfile(emailHash: string, googlePhotoUrl: string): Promise<void> {
  const wpBase = process.env.WORDPRESS_API_URL
    ?.replace(/\/graphql\/?$/, "")
    .replace(/\/$/, "");
  const user = process.env.WP_APP_USER;
  const pass = process.env.WP_APP_PASSWORD;
  if (!wpBase || !user || !pass) return;

  const authHeader = `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}`;

  await fetch(`${wpBase}/wp-json/wp/v2/user-profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: authHeader },
    body: JSON.stringify({
      title: emailHash,
      slug: emailHash,
      status: "publish",
      meta: { avatar_url: googlePhotoUrl },
    }),
  }).catch(() => null); // fire-and-forget — failure is non-critical
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

        // First login and no profile yet → auto-seed with Google photo
        if (!profile && (trigger === "signIn" || trigger === "signUp") && t.picture) {
          await ensureWPProfile(hash, t.picture);
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
