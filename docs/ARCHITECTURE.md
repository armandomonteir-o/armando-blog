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

**Target (Next.js)**: Migrate to **Zustand** for global state management:

1. **Zustand store** (`/src/stores/theme-store.ts`) - replaces `ThemeContext.tsx`. Manages `isDark` boolean + `toggle()` action. Persists to localStorage via Zustand's `persist` middleware. Simpler than Context (no provider wrapper needed), better performance (selective re-renders).
2. **localStorage** - same keys, now managed by Zustand persist middleware
3. **Component-local state** - stays the same (useState/useReducer for local UI)
4. **URL params** - Next.js App Router params prop + `usePathname()`/`useSearchParams()`

**Zustand migration example**:
```typescript
// /src/stores/theme-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
  isDark: boolean;
  toggle: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      isDark: false,
      toggle: () => set((state) => {
        const newDark = !state.isDark;
        document.documentElement.setAttribute('data-theme', newDark ? 'dark' : 'light');
        return { isDark: newDark };
      }),
    }),
    { name: 'armando-theme' }
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

## CSS Import Chain (Critical for Next.js Setup)

The entry point is `/src/styles/index.css`, which imports in this order:

```
index.css
  ├── fonts.css          → Google Fonts import (Space Grotesk, Space Mono, Rubik Glitch, Bungee Shade)
  ├── tailwind.css       → Tailwind v4 setup
  │     ├── @import 'tailwindcss' source(none)
  │     ├── @source '../**/*.{js,ts,jsx,tsx}'
  │     └── @import 'tw-animate-css'     ← animation utility classes
  └── theme.css          → CSS custom properties (--arm-*) + dark mode + @theme inline tokens
```

**For Next.js migration**:
- **Replace `fonts.css` with `next/font`** for optimized, self-hosted font loading (see font setup below)
- Configure Tailwind v4 via `@tailwindcss/postcss` in `postcss.config.js`
- Import `theme.css` in `app/layout.tsx` or a global CSS file
- Install `tw-animate-css` package if using animation utility classes from it

### Font Setup with `next/font`

Replace the Google Fonts CSS import (`fonts.css`) with `next/font` in `app/layout.tsx`:

```typescript
// app/layout.tsx
import { Space_Grotesk, Space_Mono, Rubik_Glitch, Bungee_Shade } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
});

const rubikGlitch = Rubik_Glitch({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-rubik-glitch',
  display: 'swap',
});

const bungeeShade = Bungee_Shade({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bungee-shade',
  display: 'swap',
});

// Apply to <html> or <body>:
// className={`${spaceGrotesk.variable} ${spaceMono.variable} ${rubikGlitch.variable} ${bungeeShade.variable}`}
```

Then update inline `fontFamily` references across components to use the CSS variables, or keep using the font-family strings since `next/font` with `display: 'swap'` will still match by name.

**Important**: The `@source` directive tells Tailwind where to scan for classes. In Next.js, this path may need adjustment depending on your project structure.

## Known Data Coupling Issues

- `PostsGrid.tsx` exports `posts` array and `categoryColors` map. `AllPostsPage.tsx` and `Header.tsx` (for search) import both. In the migration, all should fetch from WP independently.
- `categoryColors` is centralized in `PostsGrid.tsx` and imported by `PostPage.tsx`, `AllPostsPage.tsx`, and `Header.tsx`. In migration, centralize in a shared constants file or derive from WP category ACF fields.
- Category display names use accented characters (e.g. `"Músicas"` with ú). Ensure WP category names match exactly, or normalize on the frontend.
- `date-fns` is in `package.json` but NOT imported in any custom component — only used by shadcn/ui's calendar. Not needed for migration unless you use it for WP date formatting.