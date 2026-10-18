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
- **Newsletter**: o `NewsletterWidget` (home, post e subcategoria) fica **escondido por padrão** e só aparece com `NEXT_PUBLIC_ENABLE_NEWSLETTER=true` (`lib/features.ts`, #112), porque ainda descarta o e-mail. O `NewsletterModal` nem é montado.
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
- **State**: `notifOpen`, `notifications` (array), `searchQuery`, `searchFocused`, `searchState`, `activeIndex` (`idle` / `loading` / `done` / `error`)
- **Data dependency**: `NOTIFICATIONS` (hardcoded array, **sample content**: the bell and its panel are hidden unless `NEXT_PUBLIC_ENABLE_NOTIFICATIONS` is exactly `true`, `isNotificationsEnabled` in `lib/features.ts`, #151); the search is **real WordPress data** (#150): `GET /api/search?q=` (`app/api/search/route.ts`) validates the term (2 to 80 characters after trim, else 400, WordPress is never called) and calls `searchPosts` (5 published posts: title, slug, first category name). A failure answers 502 with a generic message
- **Behavior**:
  - Search: the debounce (300 ms) and the cancellation of the previous request (`AbortController`) live in `createSearchRunner` (`lib/search.ts`, tested without a DOM); the component only renders its state. The results window is `SearchPanel.tsx`, in the same language as the other windows (`SEARCH.EXE` title bar with a red close square, hard shadow, `--chrome-*` tokens only): each result shows the title with the typed words highlighted (`splitHighlight`, ignores case and accents) and the category as a small label on the right; a small file icon leads each row (green on the active one); loading is three skeleton rows, zero results says `nada por aqui pra “termo”` with a link to `/posts`, an error has a `TENTAR DE NOVO` button. Keyboard: `↑`/`↓` move (`moveActive`, wraps), `Enter` opens the highlighted result (the first by default), `Esc` closes; the input is a `combobox` and the rows are `option`s. Clicking a result goes to `/post/<slug>`. The panel opens from 2 characters; the term rules are shared (`normalizeSearchTerm`)
  - Notification panel: dropdown with mark-all-read, individual mark-read on click
  - Back button (desktop): calls `navigate(-1)`
  - Hamburger (mobile): calls `onMobileMenuToggle`
  - Click-outside closes panels (mousedown listener)
- **Migration**: → `components/layout/Header.tsx`. Search is done (#150). Replace `useNavigate(-1)` with `router.back()`. Replace `Link` from `react-router` with Next.js `Link`.

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
- **Props**: `post: Post | null` (nothing renders without a post) and an optional `galleryHref`
- **Data dependency**: the featured post from WordPress (#72)
- **Behavior**: Displays WavyText title, image with scanline/grid overlays, stats row, CTA buttons. The "Ver Galeria" button only exists when `galleryHref` is given, that is, when there is a gallery with at least one image. The home does not pass it yet because the gallery does not exist (it used to be a button that did nothing)

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
- **Purpose**: Wrapper around `next/image` with `sizes` required, LCP helpers, and automatic fallback on broken images
- **Props** (all `next/image` props, with these rules):
  - `sizes: string` — **required** (forces callers to always think about responsive sizes)
  - `priority?: boolean` — pass `true` for the first above-the-fold image on each page (LCP); sets `fetchpriority="high"` + `loading="eager"` automatically
  - `loading?: "lazy" | "eager"` — explicit loading hint; ignored when `priority={true}` (priority always wins)
  - No `fallbackSrc` prop — broken images silently fall back to a 1×1 transparent PNG data URI internally
- **Fill mode**: parent needs `position: relative` + a defined height; pass `fill sizes="..."` 
- **Fixed mode**: pass `width={N} height={N} sizes="Npx"`
- **Migration**: → `components/ui/AppImage.tsx` ✅ Replaces `ImageWithFallback` from prototype. Use everywhere instead of `next/image` directly.

### `SobreCharts.tsx` — NEW
- **Purpose**: Two recharts chart components for the `/sobre` page — activity area chart and skill radar
- **Exports**: `ActivityChart`, `SkillRadar`
- **Props**: None (data is hardcoded; will come from WP in a future issue)
- **Data dependency**: `activityData` (9-month post activity), `radarData` (6-subject expertise radar) — both hardcoded
- **Behavior**:
  - Each chart uses a `useWidth` hook (internal) that measures the container via `ResizeObserver` and passes explicit pixel `width` to the chart
  - Guards with `{width > 0 && ...}` — charts never render with invalid dimensions, eliminating the recharts `width(-1)/height(-1)` warning
  - Charts reflow automatically on container resize (sidebar collapse, window resize)
- **Why NOT `ResponsiveContainer`**: `ResponsiveContainer` fires a console warning on first render before its internal `ResizeObserver` measures. See PITFALL-010 and `docs/learnings/recharts-responsive-container.md`.
- **Usage**: Must be imported via `next/dynamic({ ssr: false })` at the page level — recharts is client-only and the dynamic import ensures the browser has laid out the DOM before the hook runs.
- **Location**: `components/content/SobreCharts.tsx` ✅

---

### Corpo do post (`components/content/single-post/PostBody/`)

> **Atualizado em 18/10/2026 (#84, ADR-016).** A descrição de `PostPage.tsx` logo abaixo é do protótipo. Hoje `app/post/[slug]/page.tsx` busca o post e os blocos (`getPostBlocks`) e o adaptador devolve uma lista de seções (`lib/blocks`: `sectionsFromBlocks`, cada título de nível 2 abre uma). `BlockRenderer` desenha um bloco (imagem, código e embed usam o `WindowFrame`, ver `DESIGN-SYSTEM.md`); `RichText` é o único lugar que põe HTML de autor na página, depois do `sanitize-html`. Embed vira link, imagem de host desconhecido não é otimizada, e bloco desconhecido usa um fallback sanitizado. Sem o plugin, a página mostra o texto simples.

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