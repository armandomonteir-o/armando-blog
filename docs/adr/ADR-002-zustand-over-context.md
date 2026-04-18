# ADR-002: Zustand over React Context

**Date**: 2026-04-18
**Status**: Accepted
**Deciders**: Armando Monteiro

## Context

The prototype uses a `ThemeContext.tsx` (React Context + `useReducer`) to manage dark mode state. In the Next.js migration, we need global state that:

1. Persists across page navigations (App Router doesn't remount the root layout)
2. Syncs to `localStorage` for user preference persistence
3. Sets `document.documentElement.setAttribute('data-theme', 'dark')` — NOT `classList.add('dark')`
4. Works in both Server and Client components (store must be initialized client-side)

## Decision

**Zustand** replaces `ThemeContext.tsx`.

The store will live in `store/useThemeStore.ts` with the `persist` middleware writing to `localStorage`. No Provider wrapper is needed — Zustand stores are module-level singletons.

## Consequences

### Positive
- No Provider wrapper required — eliminates the "context tree" problem in App Router
- `persist` middleware handles localStorage sync in 3 lines
- Simpler API: `useThemeStore(s => s.theme)` vs. `useContext(ThemeContext)`
- Easy to extend: future stores (user preferences, UI state) follow the same pattern

### Negative
- Adds a dependency (small: ~1.1 kB gzipped)
- Requires `"use client"` on any component that reads the store — but these components already needed it for other reasons (event handlers, animations)

### Neutral
- `ThemeContext.tsx` is deleted entirely, not migrated. Any component importing it will get a build error that forces migration — this is intentional.

## Alternatives Considered

| Option | Reason rejected |
|--------|----------------|
| React Context (keep existing) | No built-in persistence middleware. Manual `localStorage` sync in `useEffect` causes a flash of wrong theme on reload. Also requires Provider at the layout level, which has performance implications in App Router. |
| Jotai | Similar API to Zustand, also good. Zustand chosen for wider familiarity and slightly simpler devtools story. |
| Redux Toolkit | Significant overkill for managing one boolean (dark mode). |
