# Migration Guide: React SPA -> Next.js + Headless WordPress

## Target Stack (2026 Best Practices)

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 + inline styles (preserve current approach) |
| **CMS** | WordPress (headless) + ACF PRO + WPGraphQL |
| **Data Fetching** | `graphql-request` + React Server Components |
| **Caching** | Next.js ISR (Incremental Static Regeneration) + on-demand revalidation |
| **State Management** | **Zustand** (replaces React Context for global state) |
| **Animation** | `motion` package (import from `motion/react`) |
| **Icons** | `lucide-react` |
| **Charts** | `recharts` (AboutPage only) |
| **Fonts** | **`next/font`** (self-hosted, optimized — replaces Google Fonts CSS import) |
| **Images** | `next/image` with WordPress media URLs |
| **Analytics** | **Vercel Analytics** + **Plausible** (privacy-friendly, GDPR-compliant) |
| **SEO** | **`next-sitemap`** (auto sitemap.xml + robots.txt) + Next.js Metadata API |
| **Deployment** | Vercel (frontend) + managed WordPress hosting (WP Engine/Kinsta) |

## Phase 0: Project Setup ✅ Done

### 1. Create Next.js project ✅

Scaffolded with `create-next-app@latest` (installed Next.js 16.x). No `--src-dir` flag — project uses root-level `app/`, `store/`, `styles/`, `lib/` directories.

### 2. Install dependencies ✅

Core dependencies installed: `motion`, `zustand`, `graphql-request`, `graphql`, `next-sitemap`, `@vercel/analytics`. See `package.json` for exact versions.

### 3. Port static assets ✅ (partial)

- `styles/theme.css` ported from prototype (dark mode selector fixed, see PITFALL-003)
- `fonts.css` **replaced** with `next/font/google` in `app/layout.tsx` ✅
- `figma:asset/` PNG → still needs extracting to `/public/avatar-pixel-art.png`
- Unsplash URLs: port as-is when migrating each component

### 4. Set up environment variables

```env
# .env.local
NEXT_PUBLIC_WP_GRAPHQL_URL=https://your-wp-site.com/graphql
WP_AUTH_TOKEN=your-application-password-or-jwt  # For previews/drafts
```

### 5. Create GraphQL client

```typescript
// lib/graphql-client.ts
import { GraphQLClient } from 'graphql-request';

export const graphqlClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_WP_GRAPHQL_URL!,
  {
    headers: {
      // Only include auth for server-side draft previews
    },
  }
);
```

## Phase 1: Layout Shell (Priority: Highest)

Port the layout components first. These are 100% frontend — no WP data needed.

### Next.js App Router Structure

No `src/` directory — routes live at the project root:

```
app/
  layout.tsx                    # Root layout (fonts + LayoutShell)
  page.tsx                      # Home page
  not-found.tsx                 # 404 page
  posts/
    page.tsx                    # AllPostsPage
  post/
    [slug]/
      page.tsx                  # PostPage
  sobre/
    page.tsx                    # AboutPage
  playlists/
    page.tsx                    # PlaylistsPage
  categoria/
    [category]/
      page.tsx                  # CategoryPage
      [subcategory]/
        page.tsx                # SubcategoryPage
```

### Components to port as-is (no changes needed)

These are purely presentational — copy them directly:

```
/src/components/
  WavyText.tsx           # Pure SVG rendering
  RetroWindow.tsx        # Pure container component
  AeroElements.tsx       # Pure decorative SVGs
  Pagination.tsx         # Pure UI (just adapt onClick to router.push if needed)
  ScrollToTop.tsx        # Needs "use client" + adapt scroll target
  ContactCTA.tsx         # Pure presentational
  CategoryHero.tsx       # Pure presentational (receives data as props)
```

### Components that need "use client"

Any component with `useState`, `useEffect`, event handlers, or `motion` animations:

```
Header.tsx               # Search state, notification state, click handlers
Sidebar.tsx              # Hover state, mobile state, theme toggle, motion
Footer.tsx               # Hover handlers only (could be server component with minor refactor)
ThemeContext.tsx          # Context provider with localStorage
NowPlaying.tsx           # Audio playback, complex state
NewsletterWidget.tsx     # Form state, motion
NewsletterModal.tsx      # Modal state, motion
ScrollToTop.tsx          # Scroll listener, motion
CommentsSection.tsx      # (currently static, but hover handlers need client)
Pagination.tsx           # onClick handlers
```

### Layout.tsx Migration

Current pattern:
```tsx
// Current: React Router
<div className="flex h-screen w-full overflow-hidden">
  <Sidebar />
  <div id="main-content-area" className="flex-1 flex flex-col min-w-0 min-h-0">
    <Header />
    <div id="main-scroll-container" ref={scrollRef} className="flex-1 overflow-auto min-h-0">
      <Outlet />
      <Footer />
    </div>
  </div>
  <NewsletterModal />
  <ScrollToTop />
</div>
```

Next.js equivalent:
```tsx
// app/layout.tsx  (Server Component — fonts + metadata only)
export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${spaceGrotesk.variable} ...`}>
      <body>
        <LayoutShell>{children}</LayoutShell>
        {/* No ThemeProvider needed — Zustand replaces Context */}
      </body>
    </html>
  );
}
```

```tsx
// components/LayoutShell.tsx
"use client";
// Port current Layout.tsx logic here
// Replace <Outlet /> with {children}
// Replace useLocation() with usePathname() from next/navigation
// Replace location.key scroll reset with useEffect on pathname change
// Replace useTheme() with useThemeStore()
```

### Scroll Reset in Next.js

```tsx
"use client";
import { usePathname } from 'next/navigation';
import { useLayoutEffect, useRef } from 'react';

function LayoutShell({ children }) {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [pathname]);

  // ... rest of layout
}
```

### Link Migration

```tsx
// Before (react-router)
import { Link } from "react-router";
<Link to="/post/slug">...</Link>

// After (next.js)
import Link from "next/link";
<Link href="/post/slug">...</Link>
```

### Navigation Migration

```tsx
// Before
import { useNavigate } from "react-router";
const navigate = useNavigate();
navigate(-1);  // go back
navigate("/posts");  // go to page

// After
import { useRouter } from "next/navigation";
const router = useRouter();
router.back();
router.push("/posts");
```

## Phase 2: Static Pages (Priority: High)

These pages have NO WordPress data or can work with minimal data:

### NotFoundPage -> `/src/app/not-found.tsx`

Copy as-is with `"use client"` directive (has useState, useEffect for typewriter animation). No WP data.

### AboutPage -> `/src/app/sobre/page.tsx`

Decision point:
- **Option A**: Keep fully static (all skills/stats/timeline hardcoded). Simplest.
- **Option B**: Fetch from WP Options page (ACF options). More flexible but over-engineered for a personal blog.

Recommendation: **Option A**. The About page is personal and changes rarely. Add `"use client"` for the recharts charts and motion animations.

## Phase 3: WordPress-Connected Pages (Priority: High)

### AllPostsPage -> `/src/app/posts/page.tsx`

```tsx
// Server component for initial data
import { graphqlClient } from '@/lib/graphql-client';
import { GET_POSTS } from '@/lib/queries/posts';
import { AllPostsContent } from './all-posts-content';

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function PostsPage() {
  const data = await graphqlClient.request(GET_POSTS, { first: 100 });
  const posts = transformPosts(data); // Map WP response to Post interface
  return <AllPostsContent posts={posts} />;
}
```

```tsx
// "use client" component for filters, pagination, interactions
// app/posts/all-posts-content.tsx
"use client";
export function AllPostsContent({ posts }: { posts: Post[] }) {
  // Port current AllPostsPage logic, but receive posts as props instead of importing
}
```

### PostPage -> `/src/app/post/[slug]/page.tsx`

```tsx
export async function generateStaticParams() {
  const data = await graphqlClient.request(GET_ALL_POST_SLUGS);
  return data.posts.nodes.map((post) => ({ slug: post.slug }));
}

export const revalidate = 300; // 5 min ISR

export default async function PostPage({ params }: { params: { slug: string } }) {
  const data = await graphqlClient.request(GET_POST, { slug: params.slug });
  if (!data.post) notFound();

  const post = transformPost(data.post);
  const relatedPosts = await getRelatedPosts(post.category, post.slug);
  const comments = transformComments(data.post.comments);

  return <PostContent post={post} relatedPosts={relatedPosts} comments={comments} />;
}
```

### CategoryPage -> `/src/app/[categorySlug]/page.tsx`

```tsx
export async function generateStaticParams() {
  const data = await graphqlClient.request(GET_PARENT_CATEGORY_SLUGS);
  return data.categories.nodes.map((cat) => ({ categorySlug: cat.slug }));
}

export default async function CategoryPage({ params }: { params: { categorySlug: string } }) {
  const data = await graphqlClient.request(GET_CATEGORY, { slug: params.categorySlug });
  if (!data.category) notFound();
  // ...
}
```

### SubcategoryPage -> `/src/app/[categorySlug]/[subcategorySlug]/page.tsx`

Same pattern. Replace `generateMockPosts()` with actual WP query filtered by child category.

### PlaylistsPage -> `/src/app/playlists/page.tsx`

```tsx
export const revalidate = 3600; // 1 hour ISR (playlists change less often)

export default async function PlaylistsPage() {
  const data = await graphqlClient.request(GET_PLAYLISTS);
  const playlists = transformPlaylists(data);
  return <PlaylistsContent playlists={playlists} />;
}
```

### HomePage -> `/src/app/page.tsx`

The home page aggregates multiple data sources:

```tsx
export const revalidate = 60;

export default async function HomePage() {
  const [featuredPost, latestPosts, recentComments] = await Promise.all([
    getFeaturedPost(),
    getLatestPosts({ first: 13 }),
    getRecentComments({ first: 3 }),
  ]);

  return (
    <HomeContent
      featuredPost={featuredPost}
      latestPosts={latestPosts}
      recentComments={recentComments}
    />
  );
}
```

## Phase 4: Search Integration

The current search in `Header.tsx` filters from the real `posts` array imported from `PostsGrid.tsx` (an interim fix that replaced the previously hardcoded `SEARCH_POSTS` array). This works for the prototype but needs to be replaced with live WP search for production:

```tsx
// In Header.tsx (client component)
const [searchQuery, setSearchQuery] = useState("");
const [results, setResults] = useState([]);

useEffect(() => {
  if (searchQuery.length < 2) { setResults([]); return; }

  const controller = new AbortController();
  const timer = setTimeout(async () => {
    const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`, {
      signal: controller.signal,
    });
    const data = await res.json();
    setResults(data);
  }, 300); // debounce

  return () => { clearTimeout(timer); controller.abort(); };
}, [searchQuery]);
```

```tsx
// app/api/search/route.ts
import { graphqlClient } from '@/lib/graphql-client';
import { SEARCH_POSTS } from '@/lib/queries/posts';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  if (!query || query.length < 2) return Response.json([]);

  const data = await graphqlClient.request(SEARCH_POSTS, { query });
  return Response.json(data.posts.nodes.map(transformSearchResult));
}
```

## Phase 5: Comments System

Two approaches:

### Option A: WordPress Native Comments (simpler)

- Read comments via WPGraphQL (already included in post query)
- Submit comments via WP REST API mutation: `POST /wp-json/wp/v2/comments`
- Or via WPGraphQL mutation with `wp-graphql-cors` configured

### Option B: External Service (better UX)

Use a service like Giscus (GitHub Discussions based) or keep a custom implementation. The current design is very custom-styled, so WP native comments mapped to the existing card design is probably best.

The `PostCommentsSection` in `PostPage.tsx` already has a comment input UI — just wire it to a submit handler.

## Phase 6: SEO & Metadata

Next.js App Router has built-in metadata support:

```tsx
// /src/app/post/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug);
  return {
    title: `${post.title} | Armando`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.heroImage],
      type: 'article',
    },
  };
}
```

Install and configure:
- **`next-sitemap`** for automatic sitemap.xml + robots.txt generation at build time:
  ```javascript
  // next-sitemap.config.js
  /** @type {import('next-sitemap').IConfig} */
  module.exports = {
    siteUrl: 'https://armando.blog', // replace with actual domain
    generateRobotsTxt: true,
    exclude: ['/api/*'],
    robotsTxtOptions: {
      additionalSitemaps: [
        'https://armando.blog/server-sitemap.xml', // for dynamic WP content
      ],
    },
  };
  ```
  Add `"postbuild": "next-sitemap"` to `package.json` scripts.
- **Vercel Analytics** — add `<Analytics />` component in root layout:
  ```tsx
  // app/layout.tsx
  import { Analytics } from '@vercel/analytics/react';
  // Inside the <body>:
  <Analytics />
  ```
- **Plausible** (optional complement) — configure in root layout or via `<script>` tag for `plausible.io`
- Yoast SEO data via WPGraphQL for Yoast (if using Yoast on WP)

## Phase 7: WordPress Preview & Drafts

Enable draft preview from WP admin:

1. Configure WP preview URL to point to Next.js: `https://your-frontend.com/api/preview?secret=xxx&slug=yyy`
2. Create API route handler for preview mode
3. Use Next.js `draftMode()` to serve draft content

## File-by-File Migration Checklist

| Source File | Target Location | Type | Data Source | Priority |
|---|---|---|---|---|
| `App.tsx` | `layout.tsx` (merged) | - | - | P0 |
| `routes.ts` | App Router directory structure | - | - | P0 |
| `Layout.tsx` | `components/LayoutShell.tsx` | Client | - | P0 |
| `Header.tsx` | `components/Header.tsx` | Client | WP Search API | P1 |
| `Sidebar.tsx` | `components/Sidebar.tsx` | Client | - (static nav) | P0 |
| `Footer.tsx` | `components/Footer.tsx` | Client* | - | P0 |
| `ThemeContext.tsx` | **DELETED** → `store/useThemeStore.ts` ✅ | Client | localStorage (key: `arm-theme`) | P0 |
| `WavyText.tsx` | `components/WavyText.tsx` | Server | - | P0 |
| `RetroWindow.tsx` | `components/RetroWindow.tsx` | Server | - | P0 |
| `AeroElements.tsx` | `components/AeroElements.tsx` | Server | - | P0 |
| `Pagination.tsx` | `components/Pagination.tsx` | Client | - | P0 |
| `ScrollToTop.tsx` | `components/ScrollToTop.tsx` | Client | - | P0 |
| `FeaturedPost.tsx` | `components/FeaturedPost.tsx` | Server | WP featured post | P1 |
| `PostsGrid.tsx` | `components/PostsGrid.tsx` | Client | WP posts query | P1 |
| `CommentsSection.tsx` | `components/CommentsSection.tsx` | Client | WP comments | P2 |
| `NowPlaying.tsx` | `components/NowPlaying.tsx` | Client | - (or Spotify) | P3 |
| `SideContent.tsx` | `components/SideContent.tsx` | Server | WP or static | P2 |
| `CategoryHero.tsx` | `components/CategoryHero.tsx` | Server | props from page | P1 |
| `NewsletterWidget.tsx` | `components/NewsletterWidget.tsx` | Client | API route | P2 |
| `NewsletterModal.tsx` | `components/NewsletterModal.tsx` | Client | API route | P2 |
| `ContactCTA.tsx` | `components/ContactCTA.tsx` | Client | - | P2 |
| `HomePage.tsx` | `app/page.tsx` + client wrapper | Mixed | WP multiple | P1 |
| `PostPage.tsx` | `app/post/[slug]/page.tsx` | Mixed | WP post + comments | P1 |
| `CategoryPage.tsx` | `app/[categorySlug]/page.tsx` | Mixed | WP categories | P1 |
| `SubcategoryPage.tsx` | `app/[categorySlug]/[sub]/page.tsx` | Mixed | WP posts by category | P1 |
| `AllPostsPage.tsx` | `app/posts/page.tsx` | Mixed | WP all posts | P1 |
| `PlaylistsPage.tsx` | `app/playlists/page.tsx` | Mixed | WP playlists CPT | P2 |
| `AboutPage.tsx` | `app/sobre/page.tsx` | Client | Static/ACF Options | P2 |
| `NotFoundPage.tsx` | `app/not-found.tsx` | Client | - | P0 |
| `categories.ts` | `lib/queries/categories.ts` | - | WPGraphQL | P1 |
| `playlists.ts` | `lib/queries/playlists.ts` | - | WPGraphQL | P2 |
| `theme.css` | `styles/theme.css` ✅ | - | - | P0 |
| `fonts.css` | **Replaced by `next/font`** in `app/layout.tsx` ✅ | - | - | P0 |
| *(new)* | `store/useThemeStore.ts` (Zustand) ✅ | Client | localStorage | P0 |
| *(new)* | `next-sitemap.config.js` | - | - | P1 |

Priority: P0 = layout shell, P1 = core content, P2 = secondary features, P3 = nice-to-have

## On-Demand Revalidation (Webhook)

Set up a WP webhook (via "WP Webhooks" plugin or custom `save_post` action) that calls:

```
POST https://your-frontend.vercel.app/api/revalidate
Body: { secret: "xxx", path: "/post/the-slug" }
```

```tsx
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const { secret, path } = await request.json();
  if (secret !== process.env.REVALIDATION_SECRET) {
    return Response.json({ message: 'Invalid secret' }, { status: 401 });
  }
  revalidatePath(path);
  // Also revalidate home and posts listing
  revalidatePath('/');
  revalidatePath('/posts');
  return Response.json({ revalidated: true });
}
```