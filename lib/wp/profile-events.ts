const wpBase = () =>
  process.env.WORDPRESS_API_URL
    ?.replace(/\/graphql\/?$/, "")
    .replace(/\/$/, "") ?? "";

function authHeader(): string {
  const user = process.env.WP_APP_USER;
  const pass = process.env.WP_APP_PASSWORD;
  if (!user || !pass) return "";
  return `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}`;
}

export interface ProfileEventParams {
  hash: string;
  event: string;
  email?: string;
  avatar_url?: string;
  extra?: Record<string, string>;
}

// Records a user lifecycle event (login, nick_change, avatar_change) in the WP
// user-profile CPT. Also handles first-time profile creation, email storage
// (private meta, admin-only), and avatar seeding — all in a single PHP endpoint
// so private data never touches the public WP REST schema.
export async function logProfileEvent(params: ProfileEventParams): Promise<void> {
  const base = wpBase();
  const auth = authHeader();
  if (!base || !auth) return;

  const res = await fetch(`${base}/wp-json/armando/v1/profile-event`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: auth },
    body: JSON.stringify({ at: new Date().toISOString(), ...params }),
  }).catch((err) => {
    console.error("[logProfileEvent] fetch error:", err);
    return null;
  });

  if (res && !res.ok) {
    console.error(
      "[logProfileEvent] WP error:",
      res.status,
      await res.text().catch(() => "")
    );
  }
}
