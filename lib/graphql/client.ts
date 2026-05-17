import { GraphQLClient } from "graphql-request";

const endpoint = process.env.WORDPRESS_API_URL;

if (!endpoint) {
  throw new Error("WORDPRESS_API_URL is not set. Add it to .env.local");
}

export const wpClient = new GraphQLClient(endpoint, {
  headers: { "Content-Type": "application/json" },
});

export async function wpQuery<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  return wpClient.request<T>(query, variables ?? {});
}

// Authenticated client using WP Application Password — for mutations only (server-side)
function getWpAuthClient(): GraphQLClient {
  const user = process.env.WP_APP_USER;
  const pass = process.env.WP_APP_PASSWORD;
  if (!user || !pass) {
    throw new Error("WP_APP_USER or WP_APP_PASSWORD is not set. Add them to .env.local");
  }
  const token = Buffer.from(`${user}:${pass}`).toString("base64");
  return new GraphQLClient(endpoint!, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${token}`,
    },
  });
}

export async function wpMutation<T>(
  mutation: string,
  variables?: Record<string, unknown>
): Promise<T> {
  return getWpAuthClient().request<T>(mutation, variables ?? {});
}

// Authenticated query — for private post types that WPGraphQL restricts to admin users
export async function wpAuthQuery<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  return getWpAuthClient().request<T>(query, variables ?? {});
}
