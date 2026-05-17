import { wpQuery } from "../client";
import type { WPUserProfile, WPUserProfileResponse } from "../types";

const GET_USER_PROFILE = /* GraphQL */ `
  query GetUserProfile($slug: ID!) {
    userProfile(id: $slug, idType: SLUG) {
      id
      databaseId
      slug
      displayName
      avatarUrl
    }
  }
`;

export async function getUserProfile(emailHash: string): Promise<WPUserProfile | null> {
  const data = await wpQuery<WPUserProfileResponse>(GET_USER_PROFILE, { slug: emailHash });
  return data.userProfile;
}
