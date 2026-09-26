import { wpQuery } from "../client";
import type { WPCategoriesResponse, WPCategoryWithChildren } from "../types";
import { getPosts } from "./posts";

// No ACF field group is registered for categories in WordPress yet (issue #73),
// so only native fields are queried.
const GET_CATEGORIES = /* GraphQL */ `
  query GetCategories {
    categories(where: { parent: 0 }, first: 20) {
      nodes {
        slug
        name
        description
        count
        children(first: 20) {
          nodes {
            slug
            name
            description
            count
          }
        }
      }
    }
  }
`;

export async function getCategories(): Promise<WPCategoryWithChildren[]> {
  const data = await wpQuery<WPCategoriesResponse>(GET_CATEGORIES);
  return data.categories.nodes;
}

export async function getCategoryPosts(categorySlug: string, first = 12, after?: string) {
  return getPosts(first, after, categorySlug);
}
