import { wpQuery } from "../client";
import type { WPCategoriesResponse, WPCategoryWithChildren } from "../types";

const GET_CATEGORIES = /* GraphQL */ `
  query GetCategories {
    categories(where: { parent: 0 }, first: 20) {
      nodes {
        slug
        name
        description
        acfCategoryFields {
          heroImage { sourceUrl }
          accentColor
          gradientFrom
          gradientTo
          icon
        }
        children(first: 20) {
          nodes {
            slug
            name
            description
            count
            acfSubcategoryFields {
              heroImage { sourceUrl }
              subcategoryTags
            }
          }
        }
      }
    }
  }
`;

const GET_CATEGORY_POSTS = /* GraphQL */ `
  query GetCategoryPosts($categorySlug: String!, $first: Int!, $after: String) {
    posts(
      first: $first
      after: $after
      where: { categoryName: $categorySlug, status: PUBLISH }
    ) {
      pageInfo { hasNextPage endCursor }
      nodes {
        id
        slug
        title
        excerpt
        date
        commentCount
        categories { nodes { name slug } }
        featuredImage { node { sourceUrl } }
        acfPostFields {
          heroImage { sourceUrl }
          readingTime
          isFeatured
          subtitle
        }
      }
    }
  }
`;

export async function getCategories(): Promise<WPCategoryWithChildren[]> {
  const data = await wpQuery<WPCategoriesResponse>(GET_CATEGORIES);
  return data.categories.nodes;
}

export async function getCategoryPosts(
  categorySlug: string,
  first = 12,
  after?: string
) {
  const data = await wpQuery<{
    posts: {
      nodes: import("../types").WPPost[];
      pageInfo: import("../types").WPPageInfo;
    };
  }>(GET_CATEGORY_POSTS, {
    categorySlug,
    first,
    after: after ?? null,
  });
  return data.posts;
}
