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

// On login, ensure the WP user-profile has an avatar.
// Creates the profile if it doesn't exist; updates the avatar if the profile has none.
// This makes comment avatars work immediately without the user visiting /minha-conta.
async function seedWPProfileAvatar(
  emailHash: string,
  googlePhotoUrl: string,
  existingId?: number
): Promise<void> {
  const wpBase = process.env.WORDPRESS_API_URL
    ?.replace(/\/graphql\/?$/, "")
    .replace(/\/$/, "");
  const user = process.env.WP_APP_USER;
  const pass = process.env.WP_APP_PASSWORD;
  if (!wpBase || !user || !pass) return;

  const authHeader = `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}`;

  const url = existingId
    ? `${wpBase}/wp-json/wp/v2/user-profile/${existingId}`
    : `${wpBase}/wp-json/wp/v2/user-profile`;

  const body = existingId
    ? JSON.stringify({ meta: { avatar_url: googlePhotoUrl } })
    : JSON.stringify({ title: emailHash, slug: emailHash, status: "publish", meta: { avatar_url: googlePhotoUrl } });

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: authHeader },
    body,
  }).catch((err) => {
    console.error("[seedWPProfileAvatar] fetch failed:", err);
    return null;
  });

  if (res && !res.ok) {
    console.error("[seedWPProfileAvatar] WP REST error:", res.status, await res.text().catch(() => ""));
  }
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

        // On login: seed Google photo as avatar if profile has none
        if ((trigger === "signIn" || trigger === "signUp") && t.picture) {
          if (!profile) {
            await seedWPProfileAvatar(hash, t.picture);
          } else if (!profile.avatarUrl) {
            await seedWPProfileAvatar(hash, t.picture, profile.databaseId);
          }
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
