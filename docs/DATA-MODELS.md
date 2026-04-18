# Data Models & WordPress Mapping

## Current TypeScript Interfaces

### Category (`/src/app/data/categories.ts`)

```typescript
interface Subcategory {
  slug: string;
  name: string;
  description: string;
  heroImage: string;
  postCount: number;
  tags: string[];           // e.g. ["DIY", "Hardcore", "Subcultura"]
}

interface Category {
  slug: string;
  name: string;
  description: string;
  heroImage: string;
  accentColor: string;      // e.g. "#f59e0b"
  gradientFrom: string;     // e.g. "rgba(245,158,11,0.3)"
  gradientTo: string;       // e.g. "rgba(2,42,110,0.9)"
  icon: string;             // Lucide icon name: "Music", "Film", "BookOpen", "Brain", "GraduationCap"
  subcategories: Subcategory[];
}
```

**Current categories**: Musicas, Filmes, Livros, Filosofia, Estudos (5 total, each with 3-4 subcategories)

**Helper functions exported**:
- `getCategoryBySlug(slug: string): Category | undefined`
- `getSubcategoryBySlug(categorySlug, subcategorySlug): { category, subcategory } | undefined`

### Post (defined inline in `PostsGrid.tsx`)

```typescript
interface Post {
  id: number;
  title: string;
  slug: string;              // URL-safe slug (e.g. "pixel-art-e-a-nostalgia-digital")
  category: string;         // Category name (not slug)
  date: string;             // Formatted: "28 Fev 2026"
  reads: number;
  comments: number;
  image: string;            // Unsplash URL
  excerpt: string;
  isCorrupted?: boolean;    // Special visual treatment for one "glitch" post
}
```

**Note**: 13 mock posts are defined, each with a unique `slug`. One is a special "corrupted" post with ERROR category and glitch styling. The `posts` array and `categoryColors` map are exported and imported by `AllPostsPage.tsx`, `Header.tsx` (for search), and `PostPage.tsx` (for slug matching).

### Post Detail (defined inline in `PostPage.tsx`)

```typescript
const postData = {
  title: string;
  subtitle: string;
  category: string;
  date: string;
  readTime: string;         // "12 min"
  reads: number;
  comments: number;
  likes: number;
  heroImage: string;
  author: {
    name: string;
    role: string;
    avatar: string;
    bio: string;
  };
  sections: Array<{
    id: string;             // Used as anchor for TOC
    title: string;
    content: string;        // Plain text paragraphs (separated by \n\n)
  }>;
};
```

### Post Comment (defined inline in `PostPage.tsx`)

```typescript
interface PostComment {
  name: string;
  role: string;
  avatar: string;
  text: string;
  date: string;             // "17 Fev 2026"
  likes: number;
  rating: number;           // 1.0 - 5.0
}
```

### Related Post (defined inline in `PostPage.tsx`)

```typescript
interface RelatedPost {
  id: number;
  title: string;
  category: string;
  image: string;
  excerpt: string;
  slug: string;
}
```

### Playlist (`/src/app/data/playlists.ts`)

```typescript
interface PlaylistTrack {
  title: string;
  artist: string;
  duration: string;         // "3:45"
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  genres: string[];         // e.g. ["Synthwave", "Ambient"]
  trackCount: number;
  totalDuration: string;    // "2h 34min"
  followers: number;
  spotifyUrl: string;
  lastUpdated: string;      // "Mar 2026"
  accentColor: string;      // e.g. "#f59e0b"
  tracks: PlaylistTrack[];
}
```

**Genre list**: Synthwave, Punk, Lo-Fi, Ambient, Eletronica, Jazz, Hip-Hop, Post-Rock, Vaporwave, Classica, Dark Ambient

**Helper functions exported**:
- `getPlaylistsByGenre(selectedGenres: string[]): Playlist[]` (filters by array of genres, returns all if empty array)
- `genreColors: Record<string, string>`

### NowPlaying Track (defined inline in `NowPlaying.tsx`)

```typescript
interface Track {
  title: string;
  artist: string;
  album: string;
  duration: string;         // "4:12"
  src: string;              // Audio URL (Pixabay CDN)
}
```

### Sidebar Navigation Items (defined inline in `Sidebar.tsx`)

```typescript
const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Music, label: "Musicas", path: "/musicas" },
  { icon: Film, label: "Filmes", path: "/filmes" },
  { icon: BookOpen, label: "Livros", path: "/livros" },
  { icon: Brain, label: "Filosofia", path: "/filosofia" },
  { icon: GraduationCap, label: "Estudos", path: "/estudos" },
  { icon: ListMusic, label: "Playlists", path: "/playlists" },
  { icon: User, label: "Sobre Mim", path: "/sobre" },
];
```

---

## WordPress Mapping

### WP Taxonomy: `category` (native, hierarchical)

Maps to both `Category` and `Subcategory` interfaces.

**Parent categories** (5 total): Musicas, Filmes, Livros, Filosofia, Estudos

ACF fields on parent categories:
| ACF Field | Type | Maps to |
|---|---|---|
| `hero_image` | Image (URL) | `Category.heroImage` |
| `accent_color` | Color Picker | `Category.accentColor` |
| `gradient_from` | Text (rgba string) | `Category.gradientFrom` |
| `gradient_to` | Text (rgba string) | `Category.gradientTo` |
| `icon` | Select (Lucide icon name) | `Category.icon` |

**Child categories** (subcategories): Punk, Synthwave, Lo-fi, Ambient, Cyberpunk, Noir, etc.

ACF fields on child categories:
| ACF Field | Type | Maps to |
|---|---|---|
| `hero_image` | Image (URL) | `Subcategory.heroImage` |
| `subcategory_tags` | Repeater (text) | `Subcategory.tags` |

`postCount` is computed by WP query count, not stored.

### WP Post Type: `post` (native)

ACF fields:
| ACF Field | Type | Maps to |
|---|---|---|
| `hero_image` | Image (URL) | `Post.image` / `postData.heroImage` |
| `reading_time` | Text | `postData.readTime` |
| `is_featured` | True/False | Used to query featured post |
| `subtitle` | Text | `postData.subtitle` |
| `post_sections` | Repeater | `postData.sections` array |
| `post_sections.section_id` | Text | `sections[].id` (anchor) |
| `post_sections.section_title` | Text | `sections[].title` |
| `post_sections.section_content` | Textarea/WYSIWYG | `sections[].content` |

**Alternative for sections**: If using Gutenberg blocks, parse blocks instead of ACF repeater. The current content structure is simple (title + paragraphs per section), easily represented as H2 + paragraphs in Gutenberg.

Standard WP fields used:
- `title` -> `Post.title`
- `excerpt` -> `Post.excerpt`
- `date` -> `Post.date` (format with `date-fns` to "28 Fev 2026")
- `slug` -> URL routing
- `categories` -> `Post.category`
- `comment_count` -> `Post.comments`

Custom meta for view count:
- `reads` / `view_count` -> `Post.reads` (use WP plugin or custom REST endpoint to track)

### WP Post Type: `playlist` (Custom Post Type)

Register as CPT with `has_archive = true`, `rewrite => ['slug' => 'playlists']`.

ACF fields:
| ACF Field | Type | Maps to |
|---|---|---|
| `cover_image` | Image (URL) | `Playlist.coverImage` |
| `genres` | Checkbox (multi-select) | `Playlist.genres` |
| `total_duration` | Text | `Playlist.totalDuration` |
| `followers` | Number | `Playlist.followers` |
| `spotify_url` | URL | `Playlist.spotifyUrl` |
| `last_updated` | Date | `Playlist.lastUpdated` |
| `accent_color` | Color Picker | `Playlist.accentColor` |
| `tracks` | Repeater | `Playlist.tracks` |
| `tracks.track_title` | Text | `PlaylistTrack.title` |
| `tracks.track_artist` | Text | `PlaylistTrack.artist` |
| `tracks.track_duration` | Text | `PlaylistTrack.duration` |

`trackCount` is computed from tracks repeater length.

### WP Comments (native)

Maps to `PostComment` interface. WordPress native comments provide:
- `author_name` -> `name`
- `content` -> `text`
- `date` -> `date`
- `author_avatar_urls` -> `avatar`

Additional ACF fields on comments (or custom meta):
| ACF Field | Type | Maps to |
|---|---|---|
| `role` | Text | `PostComment.role` |
| `rating` | Number (1-5) | `PostComment.rating` |

`likes` could be implemented with a simple custom meta + REST endpoint.

### WP User (Author)

Enhanced user profile for the "About" page. Uses standard WP user fields + ACF user fields:
| Field | Source | Maps to |
|---|---|---|
| `display_name` | WP native | `author.name` |
| `description` | WP native | `author.bio` |
| `avatar_url` | WP native | `author.avatar` |
| `role_title` | ACF user field | `author.role` |

The `AboutPage.tsx` contains extensive hardcoded data (skills, stats, timeline, tech stack, favorite media). These could be:
- Stored as ACF fields on a "Settings" options page
- Or kept hardcoded in the frontend (simpler, since this page changes rarely)

---

## GraphQL Query Examples (WPGraphQL)

### Fetch all categories with subcategories

```graphql
query GetCategories {
  categories(where: { parent: 0 }, first: 20) {
    nodes {
      slug
      name
      description
      categoryId
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
          count  # postCount
          acfSubcategoryFields {
            heroImage { sourceUrl }
            subcategoryTags  # repeater -> string array
          }
        }
      }
    }
  }
}
```

### Fetch posts (paginated)

```graphql
query GetPosts($first: Int!, $after: String, $categorySlug: String) {
  posts(
    first: $first
    after: $after
    where: { categoryName: $categorySlug }
  ) {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
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
```

### Fetch single post

```graphql
query GetPost($slug: ID!) {
  post(id: $slug, idType: SLUG) {
    title
    content   # Or use acfPostFields.postSections repeater
    date
    excerpt
    commentCount
    categories { nodes { name slug } }
    author { node { name description avatar { url } } }
    acfPostFields {
      heroImage { sourceUrl }
      readingTime
      subtitle
      postSections {
        sectionId
        sectionTitle
        sectionContent
      }
    }
    comments(first: 50) {
      nodes {
        content
        date
        author { node { name avatar { url } } }
        acfCommentFields { role rating }
      }
    }
  }
}
```

### Fetch playlists

```graphql
query GetPlaylists($first: Int!, $after: String) {
  playlists(first: $first, after: $after) {
    nodes {
      slug
      title
      content
      acfPlaylistFields {
        coverImage { sourceUrl }
        genres
        totalDuration
        followers
        spotifyUrl
        lastUpdated
        accentColor
        tracks {
          trackTitle
          trackArtist
          trackDuration
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

### Search posts

```graphql
query SearchPosts($query: String!) {
  posts(where: { search: $query }, first: 5) {
    nodes {
      title
      slug
      categories { nodes { name } }
    }
  }
}
```

---

## Pagination Note

The current frontend uses **offset-based pagination** (page number * items per page). WPGraphQL uses **cursor-based pagination** (`after`/`before` with `endCursor`/`startCursor`).

For the migration, either:
1. Convert `Pagination.tsx` to work with cursor-based navigation
2. Use WPGraphQL's `offsetPagination` plugin to maintain offset-based queries
3. Calculate offset from page number: `after` = encode cursor for offset position

The `Pagination` component accepts: `currentPage`, `totalPages`, `totalItems`, `itemsPerPage`, `onPageChange`. This interface can stay the same; just adapt the data-fetching layer.