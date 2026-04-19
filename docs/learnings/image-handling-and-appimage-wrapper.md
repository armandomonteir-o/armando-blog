# Image Handling & the AppImage Wrapper Pattern

## The problem with plain `next/image`

`next/image` is excellent — self-hosted, lazy-loaded, WebP conversion, no layout shift. But it has one sharp edge: the `sizes` prop is optional in TypeScript, which means it's easy to forget. When you use `fill` without `sizes`, Next.js logs a browser warning and the browser downloads a larger image than necessary.

More importantly: in a blog with external image sources (Unsplash URLs, WordPress media, user-uploaded content), images **will** fail to load at some point. `next/image` has no built-in fallback — broken images just show an empty box.

## The `AppImage` wrapper

Instead of handling these problems case by case across every component, we create a single wrapper:

```tsx
// components/ui/AppImage.tsx
"use client";
import Image, { ImageProps } from "next/image";

// 1×1 transparent PNG — used when the real src fails to load
const FALLBACK_DATA_URI = "data:image/png;base64,...";

interface AppImageProps extends Omit<ImageProps, "sizes"> {
  sizes: string;  // required — enforced at compile time
}

export function AppImage({ src, alt, priority, loading, ...props }: AppImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      priority={priority}
      loading={priority ? "eager" : loading}
      onError={() => setImgSrc(FALLBACK_DATA_URI)}
    />
  );
}
```

This gives us:

1. **`sizes` is required** — TypeScript catches the omission at compile time before it reaches the browser
2. **One fallback to rule them all** — broken images silently fall back to a 1×1 transparent PNG data URI; no `/public` file needed, no 404
3. **LCP handled correctly** — pass `priority={true}` on the first above-the-fold image; it forces `loading="eager"` and `fetchpriority="high"` automatically
4. **`loading` can't conflict with `priority`** — `priority ? "eager" : loading` ensures a caller can't accidentally set `priority={true}` and `loading="lazy"` at the same time
5. **One file to update** — if `next/image` changes its API or we want to add a loading skeleton, it happens in one place

## Why this is worth the abstraction

The cost of a wrapper is that every developer on the project needs to know to use `AppImage` instead of `next/image`. On a solo project or small team, this cost is low.

The benefit scales with how many image sources you have. This project has:
- Unsplash CDN URLs (stable but external)
- WordPress media URLs (depends on WP hosting uptime)
- User avatar URLs (can 404 when accounts change)

A consistent fallback across all of these is real defensive programming.

## What `sizes` actually does

`sizes` tells the browser which image size to download before CSS has loaded. Without it, the browser assumes the image is 100vw and downloads a huge file. With it, the browser downloads the minimum needed:

```tsx
// Fixed 36px avatar — download the small size
<AppImage sizes="36px" ... />

// Card image spanning ~33% of viewport
<AppImage sizes="(max-width: 768px) 100vw, 33vw" ... />

// Full-width hero
<AppImage sizes="100vw" ... />
```

## Rule of thumb

| Image type | `sizes` value |
|---|---|
| Fixed small avatar (`w-9`, `w-10`) | `"36px"` / `"40px"` |
| Post card image (1/3 grid) | `"(max-width: 768px) 100vw, 33vw"` |
| Featured post hero | `"(max-width: 768px) 100vw, 60vw"` |
| Full-width hero | `"100vw"` |

## LCP rule of thumb

The first visible image on each page should get `priority={true}`:

```tsx
// First card in a grid — LCP candidate
<AppImage ... priority={i === 0} />

// Hero images use CSS backgroundImage (not AppImage), so no priority needed there
```

On the home page the LCP is typically in `FeaturedPost`. On `/posts` and `/playlists` it's the first card in the grid.

## Implemented in

- `components/ui/AppImage.tsx` — created in issue #7, updated with `priority`/`loading` in issue #6
- Replaces all `next/image` usage and the prototype's `ImageWithFallback`
- `fallbackSrc` prop was removed — fallback is now always the internal data URI
