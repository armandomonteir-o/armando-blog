# Learning: Zustand for State Management

**Date**: 2026-04-18
**Context**: Choosing a state management solution for dark mode in the blog migration (issue #2)
**Developer**: Armando Monteiro

---

## What is Zustand?

Zustand is a client-side state management library. Its job is the same as React Context — share state between components without passing props down manually — but with a simpler API and better performance characteristics.

A store is just a function that returns state and actions:

```ts
const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}))
```

No Provider. No wrapping your app in anything. Just import and use.

---

## Why Zustand over React Context?

### 1. Selective re-renders (the performance gain)

With React Context, every component that calls `useContext()` re-renders whenever **anything** in that context changes — even values the component doesn't use.

Zustand uses selectors:

```tsx
// Only re-renders when `theme` changes — nothing else
const theme = useThemeStore((s) => s.theme)
```

Zustand diffs the selector's return value. If it didn't change, the component is skipped entirely.

**Honest take**: for this blog right now (one value, a handful of consumers), the performance difference is invisible. The gains become real as the app grows — more values in the store, more components subscribing simultaneously.

### 2. No Provider in Next.js App Router

React Context requires a Provider at the root. A Provider must be a Client Component (`"use client"`). Putting it in `app/layout.tsx` would make the whole root layout a Client Component — which means everything inside it loses Server Component rendering by default.

Zustand has no Provider. `app/layout.tsx` stays a Server Component. Only the components that actually read the store (Header, Sidebar) become Client Components.

### 3. `persist` middleware

localStorage sync in 2 lines instead of a manual `useEffect`:

```ts
create(persist(
  (set) => ({ theme: 'light', ... }),
  { name: 'arm-theme' } // localStorage key
))
```

On page load Zustand reads from localStorage automatically. The `onRehydrateStorage` callback applies the saved theme before React renders, preventing a flash of wrong theme.

---

## SEO angle

Zustand has no direct SEO benefit — it's a client-side library and SEO comes from the server.

The indirect connection: by avoiding a Context Provider at the root, we keep more of the component tree as Server Components. Server Components render as pure HTML. Google's crawler reads that HTML. More server-rendered content = better SEO signal.

The real SEO wins for this blog come from:
1. Server Components rendering post content as HTML
2. `generateMetadata()` for per-page title, description, Open Graph
3. `next-sitemap` for the sitemap
4. `next/font` for zero CLS on fonts
5. `next/image` for optimized images (LCP)

Zustand just stays out of the way of #1.

---

## How we use it in this project

```ts
// store/useThemeStore.ts
const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => { applyTheme(theme); set({ theme }) },
      toggleTheme: () => set((s) => {
        const next = s.theme === 'light' ? 'dark' : 'light'
        applyTheme(next)
        return { theme: next }
      }),
    }),
    {
      name: 'arm-theme',
      onRehydrateStorage: () => (state) => { if (state) applyTheme(state.theme) },
    }
  )
)
```

`applyTheme` sets `document.documentElement.setAttribute('data-theme', theme)`.
Our CSS uses `[data-theme="dark"]` selectors — NOT `.dark`. See PITFALL-003.

---

## Key takeaway

Zustand's biggest practical wins for this project are **no Provider** and **persist middleware**. The performance story is real but only matters at scale. Choose it for simplicity first, performance second.
