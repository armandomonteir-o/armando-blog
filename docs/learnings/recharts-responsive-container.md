# recharts ResponsiveContainer — why it warns and how to avoid it

## The problem

recharts `ResponsiveContainer` is the standard way to make charts fill their parent. It works by starting with `containerWidth = -1, containerHeight = -1` and then measuring the DOM via `ResizeObserver`. On the very first render, before `ResizeObserver` fires, the dimensions are still -1 and recharts logs:

```
The width(-1) and height(-1) of chart should be greater than 0…
```

This is a client-side timing issue. It happens even with `next/dynamic({ ssr: false })` — the dynamic import defers the bundle load but not the first-render timing window inside `ResponsiveContainer`.

## What doesn't fix it

| Attempt | Why it fails |
|---|---|
| `minWidth: 0` on wrapper | Fixes CSS flexbox shrink, unrelated to timing |
| `useSyncExternalStore(() => true)` | Returns `true` immediately — charts render on first frame, warning still fires |
| `useState(false) + useEffect setMounted` | Correct in theory but `react-compiler` lint rule blocks synchronous `setState` inside effect body |
| `next/dynamic({ ssr: false })` alone | Defers JS load, not the ResizeObserver timing issue |
| `mounted && <ResponsiveContainer>` with any of the above | Charts still render on first client frame before measurement |

## The fix: explicit dimensions via `useWidth`

Remove `ResponsiveContainer` entirely. Measure the container yourself with a `ResizeObserver` hook, then pass explicit pixel dimensions to the chart.

```tsx
// setState lives inside the ResizeObserver callback — not synchronously
// in the effect body — so react-compiler is happy.
function useWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, width };
}

const CHART_HEIGHT = 180;

export function ActivityChart() {
  const { ref, width } = useWidth();
  return (
    <div ref={ref} style={{ width: "100%", height: CHART_HEIGHT }}>
      {width > 0 && (
        <AreaChart width={width} height={CHART_HEIGHT} data={activityData}>
          ...
        </AreaChart>
      )}
    </div>
  );
}
```

The `{width > 0 && ...}` guard ensures the chart never renders until real dimensions exist. The `useWidth` hook cleans up the observer on unmount.

**Why `setWidth` is inside the callback, not the effect body:** The `react-compiler` lint rule blocks `setState(...)` called synchronously inside a `useEffect` body (it causes cascading renders). Calling it inside a `ResizeObserver` callback is async and event-driven — the linter allows it because the effect body itself only sets up and tears down the observer, which is exactly what effects are for.

## Why this works — the render timeline

The core insight is **ownership of measurement**. With `ResponsiveContainer`, recharts owns it — and it renders once before it has any data:

```
WITH ResponsiveContainer:
1. Chart renders → containerWidth = -1 (default)
2. ⚠️  Warning fires — recharts logs the error here
3. ResizeObserver fires → re-renders with real size

WITH useWidth:
1. Chart renders → width = 0 → {width > 0 && ...} is false → nothing renders
2. ResizeObserver fires → setWidth(realWidth) → re-render
3. Chart renders with correct dimensions from the start — no warning ever fires
```

We take ownership of the measurement so we can guard against the invalid state before passing dimensions to recharts.

## Bonus: responsive on resize

Because `ResizeObserver` stays active, the chart automatically re-renders with the correct width whenever the container is resized (sidebar collapse, window resize, etc.).

## Where this is used

- `components/content/SobreCharts.tsx` — `ActivityChart` and `SkillRadar`

## When to use `ResponsiveContainer` vs `useWidth`

Use `ResponsiveContainer` only in non-Next.js apps or in components where the console warning is acceptable. In this project, always use the `useWidth` pattern for any recharts component.
