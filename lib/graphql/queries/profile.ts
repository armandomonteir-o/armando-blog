import { wpAuthQuery } from "../client";
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

// Uses authenticated client — user-profile CPT is public:false,
// WPGraphQL only returns it to authenticated (admin) users.
export async function getUserProfile(emailHash: string): Promise<WPUserProfile | null> {
  const data = await wpAuthQuery<WPUserProfileResponse>(GET_USER_PROFILE, { slug: emailHash });
  return data.userProfile;
}
