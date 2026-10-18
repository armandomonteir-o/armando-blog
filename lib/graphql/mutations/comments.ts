import { wpMutation } from "../client";
import type { WPComment } from "../types";

const CREATE_COMMENT = /* GraphQL */ `
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      success
      comment {
        id
        content
        date
        status
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
`;

interface CreateCommentResponse {
  createComment: {
    success: boolean;
    comment: (WPComment & { status: string }) | null;
  };
}

export async function createWPComment({
  postId,
  content,
  authorName,
  authorEmail,
}: {
  postId: number;
  content: string;
  authorName: string;
  authorEmail: string;
}): Promise<(WPComment & { status: string }) | null> {
  const data = await wpMutation<CreateCommentResponse>(CREATE_COMMENT, {
    input: {
      commentOn: postId,
      content,
      author: authorName,
      authorEmail,
      status: "HOLD",
    },
  });
  return data.createComment.comment;
}
