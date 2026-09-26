import { wpQuery } from "../client";
import type { WPPlaylistsResponse, WPPlaylist } from "../types";

// No ACF field group is registered for the playlist post type in WordPress yet,
// so only native fields are queried.
const GET_PLAYLISTS = /* GraphQL */ `
  query GetPlaylists($first: Int!, $after: String) {
    playlists(first: $first, after: $after) {
      pageInfo { hasNextPage endCursor }
      nodes {
        id
        slug
        title
        content
      }
    }
  }
`;

const GET_PLAYLIST = /* GraphQL */ `
  query GetPlaylist($slug: ID!) {
    playlist(id: $slug, idType: SLUG) {
      id
      slug
      title
      content
    }
  }
`;

export async function getPlaylists(
  first = 20,
  after?: string
): Promise<WPPlaylistsResponse["playlists"]> {
  const data = await wpQuery<WPPlaylistsResponse>(GET_PLAYLISTS, {
    first,
    after: after ?? null,
  });
  return data.playlists;
}

export async function getPlaylist(slug: string): Promise<WPPlaylist | null> {
  const data = await wpQuery<{ playlist: WPPlaylist | null }>(GET_PLAYLIST, {
    slug,
  });
  return data.playlist;
}
