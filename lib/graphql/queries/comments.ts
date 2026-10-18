import { wpQuery } from "../client";
import type { WPRecentComment, WPRecentCommentsResponse } from "../types";

// Approved comments on posts, newest first. Approved comments are public, so the
// unauthenticated client is enough.
const GET_RECENT_COMMENTS = /* GraphQL */ `
  query GetRecentComments($first: Int!) {
    comments(
      first: $first
      where: { status: "approve", contentType: POST, orderby: COMMENT_DATE_GMT, order: DESC }
    ) {
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
        commentedOn {
          node {
            ... on Post {
              slug
              title
            }
          }
        }
      }
    }
  }
`;

export async function getRecentComments(first = 6): Promise<WPRecentComment[]> {
  const data = await wpQuery<WPRecentCommentsResponse>(GET_RECENT_COMMENTS, { first });
  return data.comments.nodes;
}
