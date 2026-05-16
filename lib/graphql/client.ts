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
