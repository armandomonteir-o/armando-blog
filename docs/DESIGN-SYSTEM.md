# Design System Reference

## Aesthetic Identity

The blog's visual identity is a deliberate mix of three movements:

1. **Neobrutalism** - Thick borders (3px), hard box-shadows (`4px 4px 0`), no border-radius (everything is square), raw typography
2. **Retro-Digital** - Window chrome title bars, `.EXE` naming convention, pixel art decorations, faux file-system UI, scanline overlays, CRT-style effects
3. **Frutiger Aero** - Glossy gradients, glass morphism effects (`backdrop-filter: blur`), translucent surfaces, ambient orb decorations, soft color gradients

## Typography

### Fonts (currently loaded via Google Fonts in `/src/styles/fonts.css` — will be replaced by `next/font` in migration)

| Font | Usage | CSS Reference |
|---|---|---|
| **Space Grotesk** (300-700) | Primary body text, headings, titles | `'Space Grotesk', sans-serif` |
| **Space Mono** (400, 700) | Monospace elements: labels, timestamps, metadata, terminal text | `'Space Mono', monospace` |
| **Rubik Glitch** | Logo text in Sidebar only | `'Rubik Glitch', sans-serif` |
| **Bungee Shade** | Footer branding "ARMANDO" only | `'Bungee Shade', sans-serif` |

### Font Size Patterns (hardcoded, NOT Tailwind classes)

- Terminal labels / metadata: `8-9px` (Space Mono)
- Small UI text: `10-11px` (Space Mono)
- Body text: `12-13px` (Space Grotesk or Space Mono)
- Card titles: `13-14px` (Space Grotesk, weight 700)
- Section titles: `clamp(16px, 2vw, 26px)` via WavyText stacked variant
- Hero titles: `clamp(20px, 3.5vw, 40px)` via WavyText stacked variant
- Logo: `22px` (Rubik Glitch)

## Color Palette

### Primary Blues (Sidebar, Header, Dark Panels)

| Color | Hex | Usage |
|---|---|---|
| Blue primary | `#0347c1` | Main blue, sidebar bg, dark panel bg |
| Blue mid | `#0458d4` | Panel interiors, button backgrounds |
| Blue accent | `#0560e0` | Borders, dividers inside dark panels |
| Blue dark | `#022a6e` | Deepest blue, outer borders, shadows, title bars |
| Blue soft | `#80b0ff` | Secondary text on dark panels |
| Blue muted | `#5a8ad0` | Muted text, labels on dark panels |
| Blue dim | `#3a6aaa` | Dimmest text (timestamps) |
| Blue content | `#c0d8ff` | Input text, content text on dark panels |
| Blue body | `#a0c4ff` | Comment body text |

### Accent Colors

| Color | Hex | Usage |
|---|---|---|
| Green | `#4ade80` | Active/online indicators, progress bars, "Now Playing", stats |
| Red | `#e05050` | Close buttons, category "Filmes", errors |
| Purple | `#c084fc` | Category "Filosofia", comment card accents |
| Amber | `#f59e0b` | Category "Musicas", comment card accents |
| Light blue | `#80b0ff` | Category "Livros", general soft accent |
| Green (Estudos) | `#4ade80` | Category "Estudos" |
| Error red | `#ff0000` | Corrupted post special card |

### Category Color Map

```typescript
const categoryColors: Record<string, string> = {
  "Estudos": "#4ade80",
  "Filosofia": "#c084fc",
  "Musicas": "#f59e0b",
  "Filmes": "#e05050",
  "Livros": "#80b0ff",
  "ERROR": "#ff0000",
};
```

This map is defined in `PostsGrid.tsx` and exported. `PostPage.tsx`, `AllPostsPage.tsx`, and `Header.tsx` all import it from there. In the migration, centralize it or derive from WP category ACF `accentColor` fields.

## CSS Custom Properties (`/src/styles/theme.css`)

### Light Mode (`:root`)

```css
--arm-bg: #f5f0e3;              /* Cream page background */
--arm-bg-card: #e8e4dc;          /* Card body background */
--arm-bg-card-title: #c0c8e0;    /* Card title bar background */
--arm-bg-glass: rgba(232, 228, 220, 0.55);  /* Glass card background */
--arm-bg-glass-title: rgba(192, 200, 224, 0.6);  /* Glass title bar */
--arm-bg-glass-highlight: rgba(255, 255, 255, 0.7);  /* Glass button highlight */
--arm-border: #022a6e;           /* Primary border color */
--arm-text: #022a6e;             /* Primary text color */
--arm-text-secondary: #5a6a8e;   /* Secondary text */
--arm-text-muted: #7a8a9e;       /* Muted text */
--arm-grid: #022a6e;             /* Background grid lines */
--arm-blue: #0347c1;             /* Action blue */
--arm-shadow: #022a6e;           /* Box shadow color */
```

### Dark Mode (`[data-theme="dark"]`)

```css
--arm-bg: #0c0b14;
--arm-bg-card: #1a1830;
--arm-bg-card-title: #282545;
--arm-bg-glass: rgba(22, 20, 40, 0.8);
--arm-bg-glass-title: rgba(35, 32, 60, 0.85);
--arm-bg-glass-highlight: rgba(255, 255, 255, 0.1);
--arm-border: #3050a0;
--arm-text: #e4ecf8;
--arm-text-secondary: #a0b0d0;
--arm-text-muted: #7888b0;
--arm-grid: #1a2850;
--arm-blue: #4a8aff;
--arm-shadow: #080810;
```

### Panel Variables (for dark panel interiors)

These variables are defined in `theme.css` and are used by `CommentsSection.tsx` and `PostsGrid.tsx` for dark panel content areas. This ensures these components respond correctly to dark mode:

```css
/* Light mode */
--arm-panel-bg: #0458d4;
--arm-panel-bg-darker: #0347c1;
--arm-panel-border: #0560e0;
--arm-panel-bg-deep: #022a6e;
--arm-panel-text: #fff;
--arm-panel-text-soft: #80b0ff;
--arm-panel-text-muted: #5a8ad0;
--arm-panel-text-dim: #3a6aaa;
--arm-panel-text-body: #a0c4ff;
--arm-panel-text-content: #c0d8ff;

/* Dark mode */
--arm-panel-bg: #1a1830;
--arm-panel-bg-darker: #12102a;
--arm-panel-border: #2a3a70;
--arm-panel-bg-deep: #0c0b14;
--arm-panel-text: #e4ecf8;
--arm-panel-text-soft: #8090c0;
--arm-panel-text-muted: #607098;
--arm-panel-text-dim: #4a5a80;
--arm-panel-text-body: #90a8d0;
--arm-panel-text-content: #b0c8e8;
```

**Components using panel vars**: `CommentsSection.tsx`, `PostsGrid.tsx`
**Components still using hardcoded hex** (intentional — structural chrome that doesn't change in dark mode): `Header.tsx`, `Sidebar.tsx`, `RetroWindow.tsx`, `NowPlaying.tsx`, `AllPostsPage.tsx` (card grid)

## Visual Patterns

### RetroWindow (Window Chrome)

Three variants defined in `RetroWindow.tsx`:

1. **`variant="dark"`** - Blue background (`#0347c1`), used for most content blocks
   - Title bar: `#0458d4`, border: `#022a6e`
   - Body: `#0347c1`
   - Shadow: `4px 4px 0px #022a6e`

2. **`variant="light"`** - Cream background, used for general cards
   - Title bar: `var(--arm-bg-card-title)`
   - Body: `var(--arm-bg-card)`
   - Shadow: `4px 4px 0 var(--arm-shadow)`

3. **`variant="glass"`** - Translucent with backdrop blur, used for SideContent, TOC
   - Title bar: `var(--arm-bg-glass-title)` with `backdrop-filter: blur(10px)`
   - Body: `var(--arm-glass-body)` with glass sheen gradient overlay
   - Shadow includes Aero-style subtle glow

### Title Bar Pattern

Every window/panel has a title bar with:
- Left: name in Space Mono uppercase (e.g., "LATEST-POSTS.EXE", "PLAYER.EXE")
- Right: minimize button (small square) + close button (red square)
- These buttons are decorative (no functionality)

### Hover Interactions

Consistent neobrutal hover pattern across all interactive cards:
```css
/* Normal state */
transform: translate(0, 0);
box-shadow: none;

/* Hover state */
transform: translate(-2px, -2px);
box-shadow: 4px 4px 0 #022a6e;  /* or 6px 6px for larger cards */
```

### Scanline Overlay

Applied to images throughout:
```css
background-image: repeating-linear-gradient(
  0deg,
  transparent, transparent 2px,
  rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px
);
```

### Grid Background

Applied to page backgrounds (very subtle, 3% opacity):
```css
background-image:
  linear-gradient(var(--arm-grid) 1px, transparent 1px),
  linear-gradient(90deg, var(--arm-grid) 1px, transparent 1px);
background-size: 16px 16px;
```

### Glass Morphism (Aero)

Used in `SideContent`, `TableOfContents`, `GlassCard`:
```css
backdrop-filter: blur(16px);
-webkit-backdrop-filter: blur(16px);
background: var(--arm-bg-glass);  /* semi-transparent */
/* Plus a gradient sheen overlay */
```

### Glossy Bubble Decorations

Radial gradient circles with blur, placed as absolute positioned decorative elements:
```css
border-radius: 50%;
background: radial-gradient(circle at 35% 35%, rgba(255,255,255,0.2), rgba(128,176,255,0.1), transparent 70%);
filter: blur(8px);
```

## Tailwind Usage

The project uses **Tailwind CSS v4** (not v3). Key differences:
- No `tailwind.config.js` file
- Theme tokens defined via `@theme inline` in `theme.css`
- Custom variants: `@custom-variant dark (&:is(.dark *))`
- Uses `@layer base` for element defaults

Most styling is done via **inline `style` props**, not Tailwind classes. Tailwind is used mainly for:
- Layout: `flex`, `grid`, `items-center`, `gap-*`, `px-*`, `py-*`
- Responsive: `sm:`, `md:`, `lg:`, `xl:` breakpoints
- Sizing: `w-full`, `h-screen`, `flex-1`, `min-w-0`
- Utilities: `overflow-hidden`, `truncate`, `line-clamp-*`, `pointer-events-none`
- Transitions: `transition-all`, `duration-*`

Font sizes, font weights, colors, borders, and shadows are almost always inline `style` props — NOT Tailwind classes. This is intentional for the custom design system.