# Architecture Reference

## App Shell & Layout System

### Root Structure

```
App.tsx
  ThemeProvider                    # Wraps everything, manages dark mode
    RouterProvider                 # React Router v7
      Layout                      # Root route component
        Sidebar                   # Fixed left panel (blue, collapsible on non-home pages)
        div#main-content-area     # flex-1, flex col, min-w-0, min-h-0
          Header                  # Fixed top bar (blue)
          div#main-scroll-container  # flex-1, overflow-auto, min-h-0 (THE scrollable element)
            <Outlet />            # Page content renders here
            Footer                # Inside scroll container (scrolls with content)
        NewsletterModal           # Overlay, triggered from Sidebar
        ScrollToTop               # Fixed button, bottom-right
```

### Scroll System (Critical)

The app does NOT use native window scroll. The scrollable element is `#main-scroll-container`.

**Why**: The layout uses `h-screen overflow-hidden` on the root `div` to prevent double scrollbars. The sidebar and header are fixed chrome. Only the main content area scrolls.

**Components that depend on this**:
- `ScrollToTop.tsx` - listens to `#main-scroll-container` scroll events
- `ReadingProgress` (inside `PostPage.tsx`) - reads scrollTop/scrollHeight from `#main-scroll-container`
- `Layout.tsx` `useLayoutEffect` - resets `scrollRef.current.scrollTop = 0` on `location.key` change

**For Next.js migration**: You have two options:
1. Replicate the same pattern with a client component layout wrapper
2. Switch to `window` scroll (simpler, but requires refactoring `Sidebar` and `Header` positioning to `sticky` or `fixed`)

### Sidebar Behavior

- On **home page** (`/`): sidebar is expanded (220px)
- On **all other pages**: sidebar is collapsed (64px), expands on hover
- On **mobile** (`< lg` breakpoint): sidebar is hidden, slides in from left via hamburger in Header
- Sidebar contains:
  - Navigation links (Home, Musicas, Filmes, Livros, Filosofia, Estudos, Playlists, Sobre Mim)
  - Dark mode toggle (Sun/Moon icon)
  - "Notificar-me" button (triggers NewsletterModal)
  - Decorative elements (globe SVG, loading bar)

### Header Behavior

- Always visible, blue background (#0347c1)
- Contains: back button (desktop) / hamburger (mobile), search bar, notification bell, user avatars
- Search dropdown appears inline below the search input
- Notification panel drops down from bell icon
- z-index: 50

## Routing Map

| Route | Page Component | Data Dependencies |
|---|---|---|
| `/` | `HomePage` | Featured post, posts list, comments, recommendations |
| `/posts` | `AllPostsPage` | All posts (imports from `PostsGrid.tsx`), category filter |
| `/post/:slug` | `PostPage` | Single post data, related posts, comments |
| `/sobre` | `AboutPage` | Author bio, skills, stats (currently all hardcoded) |
| `/playlists` | `PlaylistsPage` | Playlists from `playlists.ts`, genre filter |
| `/:categorySlug` | `CategoryPage` | Category + subcategories from `categories.ts` |
| `/:categorySlug/:subcategorySlug` | `SubcategoryPage` | Subcategory + generated mock posts, tag filter |
| `*` | `NotFoundPage` | None (static) |

### Route Conflict Note

`/:categorySlug` catches any top-level slug. Currently it works because `getCategoryBySlug()` returns undefined for invalid slugs, and `CategoryPage` redirects to `/` with `<Navigate to="/" replace />`. In Next.js, handle this with:
- Static params from WP categories for `/[categorySlug]/page.tsx`
- Or a middleware/layout that validates category slugs

## State Management

**Current (React SPA)**: No global state library. State is managed via:

1. **ThemeContext** (React Context) - dark mode boolean + toggle function
2. **localStorage** - theme preference (`armando-theme`), music consent (`armando-music-consent`)
3. **Component-local state** - pagination, filters, search, notifications, modals
4. **URL params** - category/subcategory slugs via React Router

**Done (Next.js)**: Migrated to **Zustand** for global state management ✅

1. **Zustand store** (`store/useThemeStore.ts`) - replaces `ThemeContext.tsx`. Manages `theme: 'light' | 'dark'` + `setTheme()` / `toggleTheme()` actions. Persists to localStorage via Zustand's `persist` middleware. Simpler than Context (no provider wrapper needed), better performance (selective re-renders).
2. **localStorage** - key `arm-theme`, managed by Zustand persist middleware
3. **Component-local state** - stays the same (useState/useReducer for local UI)
4. **URL params** - Next.js App Router params prop + `usePathname()`/`useSearchParams()`

**Actual store** (`store/useThemeStore.ts`):
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => { applyTheme(theme); set({ theme }); },
      toggleTheme: () => set((s) => {
        const next: Theme = s.theme === 'light' ? 'dark' : 'light';
        applyTheme(next);
        return { theme: next };
      }),
    }),
    { name: 'arm-theme', onRehydrateStorage: () => (state) => { if (state) applyTheme(state.theme); } }
  )
);
```

## Animation Library

Uses `motion` package (formerly Framer Motion). Import: `import { motion, AnimatePresence } from "motion/react"`.

Used in:
- `Sidebar.tsx` - bell button pulse/rotate animation
- `PlaylistsPage.tsx` - `AnimatePresence mode="popLayout"` for card transitions (PlaylistCard is `forwardRef`)
- `AboutPage.tsx` - `whileInView` entry animations for stat cards
- `ScrollToTop.tsx` - enter/exit animation
- `ContactCTA.tsx` - `whileInView` entry animation
- `NewsletterModal.tsx` / `NewsletterWidget.tsx` - form state transitions
- `NotFoundPage.tsx` - glitch text animations
- `CategoryPage.tsx`, `SubcategoryPage.tsx` - card entry animations
- `AllPostsPage.tsx` - card entry animations with stagger

## Third-Party Dependencies (Actively Used)

### Current (React SPA)

| Package | Version | Where Used |
|---|---|---|
| `react-router` | 7.13.0 | All routing, `Link`, `useParams`, `useNavigate`, `useLocation` |
| `motion` | 12.23.24 | Animations throughout (import from `motion/react`) |
| `lucide-react` | 0.487.0 | All icons |
| `recharts` | 2.15.2 | `AboutPage.tsx` only (AreaChart, RadarChart) |

The `package.json` includes many more packages (shadcn/ui deps, MUI, etc.) but most are unused or only used by the `/ui/` directory components.

### Added for Next.js Migration

| Package | Purpose | Notes |
|---|---|---|
| `zustand` | Global state management | Replaces ThemeContext. Use `persist` middleware for localStorage. |
| `next/font` | Optimized font loading | Built-in Next.js module. Replaces Google Fonts CSS import. Self-hosts fonts, eliminates FOUT. |
| `@vercel/analytics` | Privacy-friendly analytics | Native Vercel integration. Add `<Analytics />` in root layout. |
| `plausible-tracker` | Complementary analytics | Lightweight, cookie-free, GDPR-compliant. Alternative/complement to Vercel Analytics. |
| `next-sitemap` | SEO: sitemap + robots.txt | Auto-generates at build time. Configure in `next-sitemap.config.js`. |
| `graphql-request` | GraphQL client for WPGraphQL | Lightweight, works in RSC (React Server Components). |
| `graphql` | GraphQL peer dependency | Required by `graphql-request`. |

## Image Handling

- **Unsplash images**: All images are from Unsplash with full query parameters. These are stable URLs.
- **`figma:asset/` imports**: Only one: `avatarPixelArt` in `Sidebar.tsx`. This is a Figma-specific virtual module that resolves to a PNG. For Next.js, extract this asset and place it in `/public/`.
- **`ImageWithFallback`**: Custom component at `/src/app/components/figma/ImageWithFallback.tsx`. Replace with `next/image` in the migration.

## Performance Considerations

- The `PostPage.tsx` is the heaviest page (~900 lines), containing inline post data, related posts, comments, author card, reading progress, and table of contents
- `PostsGrid.tsx` exports its `posts` array, which is imported by `AllPostsPage.tsx` for reuse - this coupling should be broken in the migration (both should fetch from WP)
- `SubcategoryPage.tsx` generates mock posts via `generateMockPosts()` function - replace entirely with WP queries

## CSS Import Chain ✅ Done

The entry point for the **prototype** was `/src/styles/index.css`. The **Next.js project** uses:

```
app/globals.css
  ├── @import "tailwindcss"          → Tailwind v4 (via @tailwindcss/postcss in postcss.config.mjs)
  ├── @import "tw-animate-css"       → animation utility classes
  ├── @import "../styles/theme.css"  → CSS custom properties (--arm-*) + dark mode + @theme inline tokens
  └── @theme inline { ... }          → wires font CSS variables into Tailwind (--font-sans, --font-mono, etc.)
```

Tailwind v4 is configured via `@tailwindcss/postcss` in `postcss.config.mjs` — no `tailwind.config.js` file.

### Font Setup with `next/font` ✅ Done

All 4 fonts are configured in `app/layout.tsx` via `next/font/google` (self-hosted, zero CLS):

```typescript
// app/layout.tsx
import { Space_Grotesk, Space_Mono, Rubik_Glitch, Bungee_Shade } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
  preload: false,
});

const rubikGlitch = Rubik_Glitch({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-rubik-glitch',
  display: 'swap',
  preload: false,  // display font — don't block initial render
});

const bungeeShade = Bungee_Shade({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bungee-shade',
  display: 'swap',
  preload: false,  // display font — don't block initial render
});

// Applied to <html>:
// className={`${spaceGrotesk.variable} ${spaceMono.variable} ${rubikGlitch.variable} ${bungeeShade.variable} h-full antialiased`}
```

CSS variables are wired into Tailwind via `@theme inline` in `app/globals.css`:
```css
@theme inline {
  --font-sans: var(--font-space-grotesk);
  --font-mono: var(--font-space-mono);
  --font-display-glitch: var(--font-rubik-glitch);
  --font-display-retro: var(--font-bungee-shade);
}
```

## Component Folder Convention

Components are organized by responsibility under `components/`:

| Folder | Purpose | Examples |
|---|---|---|
| `components/ui/` | Primitive, reusable UI building blocks | `RetroWindow`, `WavyText`, `AppImage`, `Pagination` |
| `components/layout/` | App chrome — persistent shell elements | `AppShell`, `Header`, `Sidebar`, `Footer` |
| `components/layout/newsletter/` | Newsletter feature — grouped under layout because triggered from Header | `NewsletterWidget`, `NewsletterModal` |
| `components/content/` | Page-level content blocks — assembled into pages | `FeaturedPost`, `PostsGrid`, `CommentsSection`, `NowPlaying` |

### Barrel index.ts rule

**Every subfolder inside `components/` must have an `index.ts`** that re-exports its public components. Consumers always import from the folder path, never from individual files:

```ts
// ✅ correct
import { NewsletterWidget } from "@/components/layout/newsletter";
import { PostsGrid } from "@/components/content";

// ❌ wrong — leaks internal file structure
import { NewsletterWidget } from "@/components/layout/newsletter/NewsletterWidget";
```

The folder path is the stable public API. If a file is renamed or split internally, only `index.ts` changes — all consumers stay untouched.

See [`docs/learnings/barrel-index-pattern.md`](learnings/barrel-index-pattern.md) for the full rationale.

## Known Data Coupling Issues

- `PostsGrid.tsx` exports `posts` array and `categoryColors` map. `AllPostsPage.tsx` and `Header.tsx` (for search) import both. In the migration, all should fetch from WP independently.
- `categoryColors` is centralized in `PostsGrid.tsx` and imported by `PostPage.tsx`, `AllPostsPage.tsx`, and `Header.tsx`. In migration, centralize in a shared constants file or derive from WP category ACF fields.
- Category display names use accented characters (e.g. `"Músicas"` with ú). Ensure WP category names match exactly, or normalize on the frontend.
- `date-fns` is in `package.json` but NOT imported in any custom component — only used by shadcn/ui's calendar. Not needed for migration unless you use it for WP date formatting.