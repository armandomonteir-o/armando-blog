import { wpQuery } from "../client";
import type { WPSearchResponse, WPSearchResult } from "../types";

const SEARCH_POSTS = /* GraphQL */ `
  query SearchPosts($query: String!, $first: Int!) {
    posts(where: { search: $query, status: PUBLISH }, first: $first) {
      nodes {
        title
        slug
        categories { nodes { name } }
      }
    }
  }
`;

export async function searchPosts(
  query: string,
  first = 5
): Promise<WPSearchResult[]> {
  if (!query.trim()) return [];
  const data = await wpQuery<WPSearchResponse>(SEARCH_POSTS, { query, first });
  return data.posts.nodes;
}
