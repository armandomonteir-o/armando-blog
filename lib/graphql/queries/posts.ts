import { wpQuery } from "../client";
import type {
  WPPostsResponse,
  WPPostDetailResponse,
  WPPost,
  WPPostDetail,
} from "../types";

const POST_FIELDS = /* GraphQL */ `
  fragment PostFields on Post {
    id
    databaseId
    slug
    title
    excerpt
    date
    commentCount
    categories { nodes { name slug } }
    featuredImage { node { sourceUrl } }
    acfPostFields {
      heroImage { node { sourceUrl } }
      readingTime
      isFeatured
      subtitle
    }
  }
`;

const GET_POSTS = /* GraphQL */ `
  ${POST_FIELDS}
  query GetPosts($first: Int!, $after: String, $categorySlug: String) {
    posts(
      first: $first
      after: $after
      where: { categoryName: $categorySlug, status: PUBLISH }
    ) {
      pageInfo { hasNextPage endCursor }
      nodes { ...PostFields }
    }
  }
`;

const GET_POST = /* GraphQL */ `
  query GetPost($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      databaseId
      slug
      title
      content
      excerpt
      date
      commentCount
      categories { nodes { name slug } }
      featuredImage { node { sourceUrl } }
      author { node { name description avatar { url } } }
      acfPostFields {
        heroImage { node { sourceUrl } }
        readingTime
        isFeatured
        subtitle
        postSections {
          sectionId
          sectionTitle
          sectionContent
        }
      }
      comments(first: 50, where: { status: "approve" }) {
        nodes {
          id
          content
          date
          author { node { name avatar { url } } }
        }
      }
    }
  }
`;

const GET_POST_SLUGS = /* GraphQL */ `
  query GetPostSlugs($first: Int!) {
    posts(first: $first, where: { status: PUBLISH }) {
      nodes { slug }
    }
  }
`;

export async function getPosts(
  first = 12,
  after?: string,
  categorySlug?: string
): Promise<WPPostsResponse["posts"]> {
  const data = await wpQuery<WPPostsResponse>(GET_POSTS, {
    first,
    after: after ?? null,
    categorySlug: categorySlug ?? null,
  });
  return data.posts;
}

// WPGraphQL does not accept metaKey/metaValue in `where`, so the ACF flag is
// filtered here, among the most recent posts.
export async function getFeaturedPost(scan = 20): Promise<WPPost | null> {
  const { nodes } = await getPosts(scan);
  return nodes.find((post) => post.acfPostFields?.isFeatured) ?? null;
}

export async function getPost(slug: string): Promise<WPPostDetail | null> {
  const data = await wpQuery<WPPostDetailResponse>(GET_POST, { slug });
  return data.post;
}

export async function getPostSlugs(first = 100): Promise<string[]> {
  const data = await wpQuery<{ posts: { nodes: { slug: string }[] } }>(
    GET_POST_SLUGS,
    { first }
  );
  return data.posts.nodes.map((n) => n.slug);
}
