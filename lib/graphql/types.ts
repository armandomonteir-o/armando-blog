// ── Posts ─────────────────────────────────────────────────────────────────────

export interface WPImage {
  sourceUrl: string;
}

export interface WPCategory {
  name: string;
  slug: string;
}

export interface WPAuthor {
  name: string;
  description: string;
  avatar: { url: string };
}

export interface WPPostSection {
  sectionId: string;
  sectionTitle: string;
  sectionContent: string;
}

export interface WPAcfPostFields {
  heroImage: { node: WPImage } | null;
  readingTime: string | null;
  isFeatured: boolean | null;
  subtitle: string | null;
  postSections: WPPostSection[] | null;
}

export interface WPPost {
  id: string;
  databaseId: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  commentCount: number | null;
  categories: { nodes: WPCategory[] };
  featuredImage: { node: WPImage } | null;
  acfPostFields: WPAcfPostFields | null;
}

export interface WPPostDetail extends WPPost {
  content: string;
  author: { node: WPAuthor };
  comments: { nodes: WPComment[] };
}

export interface WPPageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface WPPostsResponse {
  posts: {
    nodes: WPPost[];
    pageInfo: WPPageInfo;
  };
}

export interface WPPostDetailResponse {
  post: WPPostDetail | null;
}

// ── Comments ──────────────────────────────────────────────────────────────────

export interface WPAcfCommentFields {
  role: string | null;
  rating: number | null;
}

export interface WPComment {
  id: string;
  content: string;
  date: string;
  author: { node: { name: string; avatar: { url: string } } };
  acfCommentFields: WPAcfCommentFields | null;
}

// ── Categories ────────────────────────────────────────────────────────────────

export interface WPAcfCategoryFields {
  heroImage: WPImage | null;
  accentColor: string | null;
  gradientFrom: string | null;
  gradientTo: string | null;
  icon: string | null;
}

export interface WPAcfSubcategoryFields {
  heroImage: WPImage | null;
  subcategoryTags: string[] | null;
}

export interface WPSubcategory {
  slug: string;
  name: string;
  description: string;
  count: number | null;
  acfSubcategoryFields: WPAcfSubcategoryFields | null;
}

export interface WPCategoryWithChildren {
  slug: string;
  name: string;
  description: string;
  acfCategoryFields: WPAcfCategoryFields | null;
  children: { nodes: WPSubcategory[] };
}

export interface WPCategoriesResponse {
  categories: { nodes: WPCategoryWithChildren[] };
}

// ── Playlists ─────────────────────────────────────────────────────────────────

export interface WPPlaylistTrack {
  trackTitle: string;
  trackArtist: string;
  trackDuration: string;
}

export interface WPAcfPlaylistFields {
  coverImage: WPImage | null;
  genres: string[] | null;
  totalDuration: string | null;
  followers: number | null;
  spotifyUrl: string | null;
  lastUpdated: string | null;
  accentColor: string | null;
  tracks: WPPlaylistTrack[] | null;
}

export interface WPPlaylist {
  id: string;
  slug: string;
  title: string;
  content: string;
  acfPlaylistFields: WPAcfPlaylistFields | null;
}

export interface WPPlaylistsResponse {
  playlists: {
    nodes: WPPlaylist[];
    pageInfo: WPPageInfo;
  };
}

// ── User Profile ─────────────────────────────────────────────────────────────

export interface WPUserProfile {
  id: string;
  databaseId: number;
  slug: string;
  displayName: string | null;
  avatarUrl: string | null;
}

export interface WPUserProfileResponse {
  userProfile: WPUserProfile | null;
}

// ── Search ────────────────────────────────────────────────────────────────────

export interface WPSearchResult {
  title: string;
  slug: string;
  categories: { nodes: { name: string }[] };
}

export interface WPSearchResponse {
  posts: { nodes: WPSearchResult[] };
}
