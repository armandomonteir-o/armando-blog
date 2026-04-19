# Component Catalog

Complete reference for every custom component. Each entry documents: purpose, props, data dependencies, behavior notes, and migration considerations.

## Folder Convention

```
components/
  layout/     ← chrome that wraps every page (AppShell, Sidebar, Header, Footer)
  ui/         ← reusable primitives (RetroWindow, WavyText, Pagination, AeroElements...)
  content/    ← page-specific content blocks (FeaturedPost, PostsGrid, CommentsSection...)
```

---

## Layout Components (`components/layout/`)

### `Layout.tsx` (prototype)
- **Purpose**: Root route component. Assembles Sidebar + Header + scrollable content area + Footer
- **Props**: None (uses React Router Outlet)
- **State**: `mobileOpen` (sidebar toggle), `notifyOpen` (newsletter modal), `scrollRef` (scroll container)
- **Behavior**:
  - Root div: `flex h-screen w-full overflow-hidden`
  - Determines `isHomePage` from `location.pathname === "/"`
  - Passes `collapsed={!isHomePage}` to Sidebar
  - `useLayoutEffect` resets `scrollRef.current.scrollTop = 0` on `location.key` change
  - Mobile overlay: dark backdrop when sidebar is open on mobile
- **Data dependency**: None
- **Migration**: → `components/layout/AppShell.tsx`. Replace `<Outlet />` with `{children}`. Replace `useLocation` with `usePathname`. Replace `useTheme()` with `useThemeStore()`.

### `Header.tsx`
- **Purpose**: Top bar with search, notifications, user avatars
- **Props**: `onMobileMenuToggle?: () => void`
- **State**: `notifOpen`, `notifications` (array), `searchQuery`, `searchFocused`
- **Data dependency**: `NOTIFICATIONS` (hardcoded array), `posts` and `categoryColors` (imported from `PostsGrid.tsx` for search filtering)
- **Behavior**:
  - Search filters the real `posts` array by title match (case-insensitive, min 2 chars, excludes corrupted posts)
  - Notification panel: dropdown with mark-all-read, individual mark-read on click
  - Back button (desktop): calls `navigate(-1)`
  - Hamburger (mobile): calls `onMobileMenuToggle`
  - Click-outside closes panels (mousedown listener)
- **Migration**: → `components/layout/Header.tsx`. Replace search with WP search API call (debounced). Replace `useNavigate(-1)` with `router.back()`. Replace `Link` from `react-router` with Next.js `Link`.

### `Sidebar.tsx`
- **Purpose**: Left navigation panel
- **Props**: `collapsed`, `mobileOpen`, `onMobileClose`, `onNotifyClick`
- **State**: `hovered` (for expand on hover when collapsed)
- **Data dependency**: `navItems` (hardcoded), `avatarPixelArt` (figma:asset import)
- **Behavior**:
  - Expands/collapses with CSS transition on width (220px / 64px)
  - Active nav detection: exact match for `/`, startsWith for others
  - Contains dark mode toggle via `useTheme()`
  - Mobile: fixed position, slide-in from left, full height
  - Animated bell button with `motion` (rotate + pulse)
- **Migration**: → `components/layout/Sidebar.tsx`. Replace `Link`/`useLocation` with Next.js equivalents. Replace `figma:asset/` import with `/public/avatar-pixel-art.png`. Replace `useTheme()` with `useThemeStore()`. Add `"use client"`.

### `Footer.tsx`
- **Purpose**: Bottom section with branding, nav links, social icons
- **Props**: `contextLabel?: string` (optional extra text)
- **Data dependency**: `navLinks` and `socialLinks` (hardcoded)
- **Behavior**: Hover color changes via inline event handlers
- **Migration**: → `components/layout/Footer.tsx`. Replace `Link` with Next.js `Link`. Could potentially be a server component if hover handlers are moved to CSS.

### `ThemeContext.tsx` — **DELETED** ✅

Replaced by `store/useThemeStore.ts` (Zustand). The `useThemeStore()` hook replaces `useTheme()`. No provider wrapper needed — components import the hook directly.

- `theme: 'light' | 'dark'` replaces `isDark: boolean`
- `toggleTheme()` replaces `toggle()`
- localStorage key: `arm-theme` (was `armando-theme`)
- `onRehydrateStorage` callback applies theme to `<html>` on load (prevents flash of wrong theme)

---

## Content Components

### `RetroWindow.tsx`
- **Purpose**: Window chrome wrapper used everywhere
- **Props**: `title: string`, `children`, `className?`, `variant?: "dark" | "light" | "glass"`, `onClose?: boolean`, `onMinimize?: boolean`, `style?`
- **Data dependency**: None
- **Behavior**:
  - Three visual variants with different color schemes
  - Title bar with decorative minimize/close buttons (non-functional)
  - Glass variant adds backdrop-filter and gradient sheen
- **Migration**: → `components/ui/RetroWindow.tsx` ✅ Server Component (no `"use client"` needed)

### `WavyText.tsx`
- **Purpose**: SVG text rendered along wavy paths
- **Props**: `text`, `className?`, `amplitude?`, `frequency?`, `fontSize?`, `color?`, `strokeColor?`, `variant?: "wavy" | "stacked" | "linear-wave"`
- **Data dependency**: None
- **Behavior**:
  - `"stacked"`: CSS-only stacked text with stroke outlines (no SVG)
  - `"wavy"`: SVG textPath on a sine wave
  - `"linear-wave"`: SVG textPath on a gentler sine wave
  - Generates unique IDs with `Math.random()`
- **Migration**: → `components/ui/WavyText.tsx` ✅ `"use client"` — `Math.random()` IDs replaced with `useId()` for SSR safety

### `FeaturedPost.tsx`
- **Purpose**: Hero section for featured post on home page
- **Props**: None (data hardcoded inside)
- **Data dependency**: Hardcoded post data (title, image, excerpt, stats)
- **Behavior**: Displays WavyText title, image with scanline/grid overlays, stats row, CTA buttons
- **Migration**: Convert to accept props for post data from WP. Keep visual structure identical.

### `PostsGrid.tsx`
- **Purpose**: Grid of post cards with pagination
- **Props**: None (uses internal state + hardcoded `posts` array)
- **Exports**: `posts: Post[]` (imported by `AllPostsPage`, `Header`, `PostPage`), `categoryColors: Record<string, string>`
- **Data dependency**: 13 hardcoded posts (each with unique `slug` field)
- **Behavior**:
  - 6 posts per page, 3-column grid (responsive)
  - Each card: mini title bar, image with scanline overlay + category badge, title, excerpt, meta (date, reads, comments)
  - Each card links to `/post/${post.slug}` (unique per post)
  - Special "corrupted" post with red border animation
  - Neobrutal hover effect (translate + box-shadow)
  - Uses `var(--arm-panel-*)` CSS variables for dark panel colors (dark mode compatible)
- **Migration**: Accept `posts` as prop. Slugs come from WP. Move `categoryColors` to shared constants. Keep corrupted post as an optional easter egg.

### `CommentsSection.tsx`
- **Purpose**: Community reviews section on home page
- **Props**: None
- **Data dependency**: 3 hardcoded comments + engagement chart data
- **Behavior**:
  - Left panel: rating (4.4/5.0), total count (127), engagement bar chart (custom CSS, NOT recharts), progress bar decoration
  - Right panel: 3 comment cards with accent colors, avatar, rating stars, reaction buttons, timestamp
  - "Ver todos" links to `/posts` page
  - Uses `var(--arm-panel-*)` CSS variables for dark panel colors (dark mode compatible)
- **Migration**: Accept `comments` as prop from WP. Could link "Ver todos" to a dedicated comments page or anchor.

### `Pagination.tsx`
- **Purpose**: Reusable pagination with progress indicator
- **Props**: `currentPage`, `totalPages`, `totalItems`, `itemsPerPage`, `onPageChange: (page: number) => void`
- **Data dependency**: None
- **Behavior**: Previous/next buttons, numbered page buttons, "SHOWING X-Y OF Z" text, green progress bar
- **Migration**: → `components/ui/Pagination.tsx` ✅ `"use client"` added

### `SideContent.tsx`
- **Purpose**: Recommendations sidebar (right side of home page)
- **Props**: None
- **Data dependency**: 6 hardcoded recommendations
- **Behavior**: Glass variant RetroWindow, list of items with icons, types, and hover effects
- **Migration**: Could be WP-powered (latest posts from each category) or kept static. Accept recommendations as prop.

### `NowPlaying.tsx`
- **Exports**: `MusicConsentBar`, `NowPlayingWidget`
- **Purpose**: Winamp-style audio player
- **Data dependency**: 4 hardcoded tracks with Pixabay audio URLs
- **Behavior**:
  - `MusicConsentBar`: Appears after 1.2s delay, asks user permission to play audio. Result stored in localStorage.
  - `NowPlayingWidget`: Full player with play/pause, skip, volume, seek, track list, equalizer bars, marquee text, vinyl animation
  - Can be minimized to compact bar
  - Auto-plays first track on mount (after consent)
- **Migration**: Port as-is with `"use client"`. Independent of WP. Future enhancement: integrate with Spotify API for real track data.

### `AeroElements.tsx`
- **Exports**: `AeroElements` (decorative overlay) — `GlassCard` split into its own file (see below)
- **Internal sub-components** (not exported): `PixelCursor`, `PixelHeart`, `PixelFolder`, `PixelHourglass`, `GlassOrb`, `GlossyBubble`, `GlassSheen`, `AquaWave`
- **Purpose**: Decorative Frutiger Aero elements — glossy bubbles, floating orbs, pixel art icons, glass sheen effects
- **Props**: `GlassCard` accepts `children`, `className?`, `style?`, `onMouseEnter?`, `onMouseLeave?`
- **Data dependency**: None
- **Behavior**:
  - `AeroElements` renders an absolutely positioned overlay with: 4 `GlassOrb`s (radial gradient blurs), 6 `GlossyBubble`s (translucent spheres), 2 `AquaWave`s (SVG sine waves), 6 pixel art icons (cursor, hearts, folder, hourglass) with bounce animation, 2 `GlassSheen` corner overlays
  - `GlassCard` is a glassmorphism wrapper with `backdrop-filter: blur(16px)` and an internal glass shine gradient
  - CSS keyframe animations defined via `<style>` tag: `aeroFloat`, `aeroBubble`, `aeroSpin`, `pixelBounce`
- **Overflow handling**: The `AeroElements` container itself has `overflow-hidden`. Additionally, all 7 page wrappers that use `AeroElements` (HomePage, PostPage, CategoryPage, SubcategoryPage, AboutPage, PlaylistsPage, AllPostsPage) have `overflow-hidden` on their root div to prevent any decorative elements from causing horizontal scroll on narrow viewports.
- **Migration**: → `components/ui/AeroElements.tsx` ✅ Server Component. `GlassCard` split into `components/ui/GlassCard.tsx` (`"use client"`) because it needs hover event handlers.

### `ScrollToTop.tsx`
- **Purpose**: Fixed button (bottom-right) that scrolls `#main-scroll-container` to top
- **Data dependency**: None
- **Behavior**: Appears after scrolling 400px, `motion` enter/exit animation, smooth scroll on click
- **Migration**: → `components/ui/ScrollToTop.tsx` ✅ `"use client"`, wired into `AppShell`. References `#main-scroll-container` — see PITFALL-004.

### `AppImage.tsx` — NEW
- **Purpose**: Wrapper around `next/image` with `sizes` required and automatic fallback on broken images
- **Props**: All `next/image` props except `sizes` is now required; `fallbackSrc?: string`
- **Migration**: → `components/ui/AppImage.tsx` ✅ Replaces `ImageWithFallback` from prototype. Use everywhere instead of `next/image` directly.

---

### `PostPage.tsx` (~900 lines)
- **Data dependencies**: `postData` object (hardcoded inline), `relatedPosts` array, `postComments` array. Also imports `posts` and `categoryColors` from `PostsGrid.tsx` to dynamically match the current post by URL slug.
- **Internal components**: `ReadingProgress`, `TableOfContents`, `AuthorCard`, `PostCommentsSection`
- **State**: `activeSection` (intersection observer for TOC), `commentPage`, `liked`, `saved`
- **Behavior**:
  - Uses `useParams()` to read the `:slug` from the URL
  - Matches the slug against the `posts` array to override hero metadata (title, image, category, date, reads, comments) — article body content stays shared (prototype limitation)
  - Reading progress bar (sticky, references `#main-scroll-container`)
- **Migration**: Split into server + client components. Move `postData` into WP (each post will have its own full content). The inline components (`ReadingProgress`, `TOC`, etc.) should become separate files.