import { wpQuery } from "../client";
import type { WPPostsResponse, WPPostDetailResponse, WPPostDetail } from "../types";
import type { EditorBlock } from "@/lib/blocks";

const POST_FIELDS = /* GraphQL */ `
  fragment PostFields on Post {
    id
    databaseId
    slug
    title
    excerpt
    date
    commentCount
    isSticky
    categories {
      nodes {
        name
        slug
      }
    }
    featuredImage {
      node {
        sourceUrl
      }
    }
    acfPostFields {
      heroImage {
        node {
          sourceUrl
        }
      }
      readingTime
      isFeatured
      subtitle
    }
  }
`;

const GET_POSTS = /* GraphQL */ `
  ${POST_FIELDS}
  query GetPosts($first: Int!, $after: String, $categorySlug: String) {
    posts(first: $first, after: $after, where: { categoryName: $categorySlug, status: PUBLISH }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...PostFields
      }
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
      categories {
        nodes {
          name
          slug
        }
      }
      featuredImage {
        node {
          sourceUrl
        }
      }
      author {
        node {
          name
          description
          avatar {
            url
          }
        }
      }
      acfPostFields {
        heroImage {
          node {
            sourceUrl
          }
        }
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
          author {
            node {
              name
              avatar {
                url
              }
            }
          }
        }
      }
    }
  }
`;

const GET_POST_SLUGS = /* GraphQL */ `
  query GetPostSlugs($first: Int!) {
    posts(first: $first, where: { status: PUBLISH }) {
      nodes {
        slug
      }
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

export async function getPost(slug: string): Promise<WPPostDetail | null> {
  const data = await wpQuery<WPPostDetailResponse>(GET_POST, { slug });
  return data.post;
}

export async function getPostSlugs(first = 100): Promise<string[]> {
  const data = await wpQuery<{ posts: { nodes: { slug: string }[] } }>(GET_POST_SLUGS, { first });
  return data.posts.nodes.map((n) => n.slug);
}

// The post body as Gutenberg blocks (#84), from the WPGraphQL Content Blocks plugin. It is a
// separate query on purpose: if the plugin is missing, only this one fails, and the post page can
// still show the text. Three levels of nesting cover a list inside a quote inside a column.
const GET_POST_BLOCKS = /* GraphQL */ `
  fragment PostBlock on EditorBlock {
    __typename
    name
    clientId
    renderedHtml
    ... on CoreHeading {
      attributes {
        content
        level
        anchor
      }
    }
    ... on CoreParagraph {
      attributes {
        content
      }
    }
    ... on CoreImage {
      attributes {
        url
        alt
        caption
        width
        height
      }
    }
    ... on CoreList {
      attributes {
        ordered
        start
        reversed
      }
    }
    ... on CoreListItem {
      attributes {
        content
      }
    }
    ... on CoreQuote {
      attributes {
        citation
      }
    }
    ... on CoreCode {
      attributes {
        content
      }
    }
    ... on CoreEmbed {
      attributes {
        url
        providerNameSlug
        caption
      }
    }
  }

  query GetPostBlocks($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      editorBlocks(flat: false) {
        ...PostBlock
        innerBlocks {
          ...PostBlock
          innerBlocks {
            ...PostBlock
          }
        }
      }
    }
  }
`;

export async function getPostBlocks(slug: string): Promise<EditorBlock[] | null> {
  const data = await wpQuery<{ post: { editorBlocks: EditorBlock[] } | null }>(GET_POST_BLOCKS, {
    slug,
  });
  return data.post?.editorBlocks ?? null;
}
